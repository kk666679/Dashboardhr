/**
 * Secrets Manager adapter with retry logic and better error handling
 */

// ─── Type Definitions ────────────────────────────────────────────────────────

export interface SecretsProvider {
  /** Retrieve a secret value by key. Throws if the key is not found. */
  get(key: string): Promise<string>;
}

export type SecretsProviderName = "aws" | "azure" | "hashicorp" | "vault" | "env";

// ─── AWS SDK Types ──────────────────────────────────────────────────────────

interface AWSSecretsManagerClient {
  send(command: unknown): Promise<{ SecretString?: string }>;
}

interface AWSGetSecretValueCommand {
  new (input: { SecretId: string }): unknown;
}

interface AWSSDK {
  SecretsManagerClient: new (config: { region: string }) => AWSSecretsManagerClient;
  GetSecretValueCommand: AWSGetSecretValueCommand;
}

// ─── Azure SDK Types ────────────────────────────────────────────────────────

interface AzureSecretClient {
  getSecret(key: string): Promise<{ value?: string }>;
}

interface AzureDefaultAzureCredential {
  new (): unknown;
}

interface AzureSDK {
  SecretClient: new (vaultUrl: string, credential: unknown) => AzureSecretClient;
  DefaultAzureCredential: AzureDefaultAzureCredential;
}

// ─── HashiCorp Vault Types ─────────────────────────────────────────────────

interface VaultResponse {
  data?: {
    data?: Record<string, string>;
  };
}

// ─── Base Adapter with Retry Logic ──────────────────────────────────────────

abstract class BaseSecretsAdapter implements SecretsProvider {
  protected cache = new Map<string, string>();
  protected maxRetries = 3;
  protected retryDelay = 1000; // milliseconds

  abstract get(key: string): Promise<string>;

  protected async withRetry<T>(
    operation: () => Promise<T>,
    context: string
  ): Promise<T> {
    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        
        if (attempt < this.maxRetries) {
          console.warn(
            `[secrets] ${context} failed (attempt ${attempt}/${this.maxRetries}):`,
            lastError.message
          );
          await this.delay(this.retryDelay * attempt);
        }
      }
    }
    
    throw new Error(
      `[secrets] ${context} failed after ${this.maxRetries} attempts: ${lastError?.message}`
    );
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  public clearCache(): void { // eslint-disable-line
    this.cache.clear();
  }
}

// ─── Env fallback with retry ─────────────────────────────────────────────────

class EnvFallbackAdapter extends BaseSecretsAdapter {
  async get(key: string): Promise<string> {
    return this.withRetry(async () => {
      const value = process.env[key];
      if (!value) {
        throw new Error(`Secret "${key}" not found in environment`);
      }
      return value;
    }, `env:${key}`);
  }
}

// ─── AWS Secrets Manager with retry ──────────────────────────────────────────

class AwsSecretsManagerAdapter extends BaseSecretsAdapter {
  private client?: AWSSecretsManagerClient;

  private async getClient(): Promise<AWSSecretsManagerClient> {
    if (this.client) return this.client;

    let awsSdk: AWSSDK;
    try {
      awsSdk = require("@aws-sdk/client-secrets-manager") as AWSSDK;
    } catch {
      throw new Error(
        "@aws-sdk/client-secrets-manager is not installed. " +
          "Run: npm install @aws-sdk/client-secrets-manager"
      );
    }

    const { SecretsManagerClient } = awsSdk;
    this.client = new SecretsManagerClient({
      region: process.env.AWS_REGION ?? "ap-southeast-1",
    } as any);
    
    return this.client;
  }

  async get(key: string): Promise<string> {
    if (this.cache.has(key)) {
      return this.cache.get(key)!;
    }

    const secret = await this.withRetry(async () => {
      const client = await this.getClient();
      const { GetSecretValueCommand } = require("@aws-sdk/client-secrets-manager");
      
      const command = new GetSecretValueCommand({ SecretId: key });
      const response = await client.send(command);
      
      const value = response.SecretString ?? "";
      if (!value) {
        throw new Error(`AWS secret "${key}" is empty`);
      }
      return value;
    }, `aws:${key}`);

    this.cache.set(key, secret);
    return secret;
  }
}

// ─── Azure Key Vault with retry ─────────────────────────────────────────────

class AzureKeyVaultAdapter extends BaseSecretsAdapter {
  private client?: AzureSecretClient;

  private async getClient(): Promise<AzureSecretClient> {
    if (this.client) return this.client;

    let azureSecrets: AzureSDK;
    let azureIdentity: { DefaultAzureCredential: AzureDefaultAzureCredential };
    
    try {
      azureSecrets = require("@azure/keyvault-secrets") as AzureSDK;
      azureIdentity = require("@azure/identity") as { DefaultAzureCredential: AzureDefaultAzureCredential };
    } catch {
      throw new Error(
        "@azure/keyvault-secrets and @azure/identity are not installed. " +
          "Run: npm install @azure/keyvault-secrets @azure/identity"
      );
    }

    const { SecretClient } = azureSecrets;
    const { DefaultAzureCredential } = azureIdentity;

    const vaultUrl = process.env.AZURE_KEYVAULT_URL;
    if (!vaultUrl) {
      throw new Error("AZURE_KEYVAULT_URL env var is required");
    }

    const credential = new DefaultAzureCredential();
    this.client = new SecretClient(vaultUrl, credential);
    
    return this.client;
  }

  async get(key: string): Promise<string> {
    if (this.cache.has(key)) {
      return this.cache.get(key)!;
    }

    const secret = await this.withRetry(async () => {
      const client = await this.getClient();
      const response = await client.getSecret(key);
      
      const value = response.value ?? "";
      if (!value) {
        throw new Error(`Azure Key Vault secret "${key}" is empty`);
      }
      return value;
    }, `azure:${key}`);

    this.cache.set(key, secret);
    return secret;
  }
}

// ─── HashiCorp Vault with retry ─────────────────────────────────────────────

class HashiCorpVaultAdapter extends BaseSecretsAdapter {
  async get(key: string): Promise<string> {
    if (this.cache.has(key)) {
      return this.cache.get(key)!;
    }

    const secret = await this.withRetry(async () => {
      const vaultAddr = process.env.VAULT_ADDR ?? "http://localhost:8200";
      const token = process.env.VAULT_TOKEN;
      
      if (!token) {
        throw new Error("VAULT_TOKEN env var is required");
      }

      const url = `${vaultAddr}/v1/secret/data/${key}`;
      const res = await fetch(url, {
        headers: { "X-Vault-Token": token },
      });

      if (!res.ok) {
        throw new Error(
          `Vault fetch failed for "${key}": HTTP ${res.status} ${res.statusText}`
        );
      }

      const json = (await res.json()) as VaultResponse;
      const value = json.data?.data?.value ?? json.data?.data?.[key];
      
      if (!value) {
        throw new Error(`HashiCorp Vault secret "${key}" not found`);
      }
      return value;
    }, `vault:${key}`);

    this.cache.set(key, secret);
    return secret;
  }
}

// ─── Factory with validation ──────────────────────────────────────────────────

export function createSecretsProvider(
  providerName?: SecretsProviderName | string
): SecretsProvider {
  const provider = (providerName ?? process.env.SECRETS_PROVIDER ?? "env").toLowerCase();
  
  // Validate provider name
  const validProviders: SecretsProviderName[] = ["aws", "azure", "hashicorp", "vault", "env"];
  if (!validProviders.includes(provider as SecretsProviderName)) {
    console.warn(
      `[secrets] Unknown provider "${provider}", falling back to "env"`
    );
    return new EnvFallbackAdapter();
  }

  switch (provider) {
    case "aws":
      return new AwsSecretsManagerAdapter();
    case "azure":
      return new AzureKeyVaultAdapter();
    case "hashicorp":
    case "vault":
      return new HashiCorpVaultAdapter();
    case "env":
    default:
      if (process.env.NODE_ENV === "production") {
        console.warn(
          "[secrets] WARNING: Using env fallback in production. " +
            "Set SECRETS_PROVIDER=aws|azure|hashicorp."
        );
      }
      return new EnvFallbackAdapter();
  }
}

// ─── Singleton with lazy initialization ──────────────────────────────────────

let secretsInstance: SecretsProvider | null = null;

export function getSecretsProvider(): SecretsProvider {
  if (!secretsInstance) {
    secretsInstance = createSecretsProvider();
  }
  return secretsInstance;
}

export const secrets: SecretsProvider = getSecretsProvider();

// ─── Utility Functions ──────────────────────────────────────────────────────

/**
 * Clear the secrets cache for all adapters
 * Useful for testing or when secrets are rotated
 */
export function clearSecretsCache(): void {
  if (secretsInstance && secretsInstance instanceof BaseSecretsAdapter) {
    secretsInstance.clearCache();
  }
}

/**
 * Reset the secrets provider singleton
 * Useful for testing or when provider configuration changes
 */
export function resetSecretsProvider(): void {
  if (secretsInstance instanceof BaseSecretsAdapter) {
    secretsInstance.clearCache();
  }
  secretsInstance = null;
}

/**
 * Check if a secret exists without throwing
 */
export async function secretExists(key: string): Promise<boolean> {
  try {
    await secrets.get(key);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get a secret with a fallback value
 */
export async function getSecretWithFallback(
  key: string, 
  fallback: string
): Promise<string> {
  try {
    return await secrets.get(key);
  } catch {
    return fallback;
  }
}

/**
 * Get multiple secrets in parallel
 */
export async function getMultipleSecrets(
  keys: string[]
): Promise<Record<string, string>> {
  const results: Record<string, string> = {};
  
  await Promise.all(
    keys.map(async (key) => {
      try {
        results[key] = await secrets.get(key);
      } catch (error) {
        console.error(`[secrets] Failed to get secret "${key}":`, error);
        results[key] = "";
      }
    })
  );
  
  return results;
}

// ─── Type Exports ────────────────────────────────────────────────────────────
// NOTE: Do not re-export `SecretsProvider` and `SecretsProviderName` here because
// they are already exported as top-level declarations above. Re-exporting causes
// TS2484 export conflicts.

export type {
  AWSSecretsManagerClient,
  AWSGetSecretValueCommand,
  AWSSDK,
  AzureSecretClient,
  AzureDefaultAzureCredential,
  AzureSDK,
  VaultResponse,
};
