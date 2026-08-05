import "server-only";

type EnvCache = Map<string, string>;
const envCache: EnvCache = new Map();

export interface EnvValidation {
  pattern?: RegExp;
  minLength?: number;
  maxLength?: number;
  custom?: (value: string) => boolean;
}

/**
 * Reads a required server-only configuration value with validation and caching.
 * Do not expose secrets through `next.config` or `NEXT_PUBLIC_*` variables.
 */
export function getRequiredServerEnv(
  name: string,
  validation?: EnvValidation
): string {
  // Check cache first
  if (envCache.has(name)) {
    return envCache.get(name)!;
  }

  const value = process.env[name];
  
  // Check existence
  if (!value) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        `⚠️ Missing environment variable: ${name}\n` +
        `Create a .env.local file in your project root and add:\n` +
        `${name}=your_value_here`
      );
    }
    throw new Error(`Missing required server environment variable: ${name}`);
  }

  // Run validations
  if (validation) {
    if (validation.pattern && !validation.pattern.test(value)) {
      throw new Error(
        `Environment variable ${name} does not match required pattern: ${validation.pattern.source}`
      );
    }
    if (validation.minLength && value.length < validation.minLength) {
      throw new Error(
        `Environment variable ${name} must be at least ${validation.minLength} characters`
      );
    }
    if (validation.maxLength && value.length > validation.maxLength) {
      throw new Error(
        `Environment variable ${name} must be at most ${validation.maxLength} characters`
      );
    }
    if (validation.custom && !validation.custom(value)) {
      throw new Error(`Environment variable ${name} failed custom validation`);
    }
  }

  // Cache and return
  envCache.set(name, value);
  return value;
}

// Convenience functions
export function getRequiredServerUrl(name: string): string {
  const value = getRequiredServerEnv(name);
  try {
    new URL(value);
    return value;
  } catch {
    throw new Error(`Environment variable ${name} must be a valid URL`);
  }
}

export function getRequiredServerPort(name: string): number {
  const value = getRequiredServerEnv(name);
  const port = parseInt(value, 10);
  if (isNaN(port) || port < 1 || port > 65535) {
    throw new Error(`Environment variable ${name} must be a valid port number (1-65535)`);
  }
  return port;
}

export function getRequiredServerBoolean(name: string): boolean {
  const value = getRequiredServerEnv(name);
  if (value.toLowerCase() === "true") return true;
  if (value.toLowerCase() === "false") return false;
  throw new Error(`Environment variable ${name} must be "true" or "false"`);
}

export function clearEnvCache(): void {
  envCache.clear();
}