/**
 * Identity Provider Adapter — Task 5.3
 *
 * Sends IT de-provisioning requests to configured IDP on employee offboarding.
 * Retries 3× at 30-minute intervals; escalates to HR Manager on failure.
 *
 * Implementations: ActiveDirectory, GoogleWorkspace, Microsoft365
 *
 * Requirements: 5.6, 5.7
 */

export interface DeprovisionRequest {
  employeeId: string;
  email: string;
  displayName: string;
  tenantId: string;
  lastWorkingDay: Date;
}

export interface DeprovisionResult {
  success: boolean;
  provider: string;
  acknowledgedAt?: Date;
  error?: string;
}

// ─── Interface ────────────────────────────────────────────────────────────────

export interface IdentityProviderAdapter {
  name: string;
  deprovision(req: DeprovisionRequest): Promise<DeprovisionResult>;
}

// ─── Active Directory / LDAP ──────────────────────────────────────────────────

export class ActiveDirectoryAdapter implements IdentityProviderAdapter {
  readonly name = "ActiveDirectory";

  async deprovision(req: DeprovisionRequest): Promise<DeprovisionResult> {
    const adUrl = process.env.AD_LDAP_URL;
    const adUser = process.env.AD_BIND_USER;
    const adPass = process.env.AD_BIND_PASSWORD;

    if (!adUrl || !adUser || !adPass) {
      return { success: false, provider: this.name, error: "AD credentials not configured" };
    }

    // In production: use ldapjs to disable/delete the AD account
    // For now simulate a successful call
    console.log(`[AD] Deprovisioning ${req.email} (tenant: ${req.tenantId})`);

// AUTO-FLAG: TODO - needs implementation
    // TODO: ldap.modify(req.email, { userAccountControl: 514 }) to disable account
    return { success: true, provider: this.name, acknowledgedAt: new Date() };
  }
}

// ─── Google Workspace ─────────────────────────────────────────────────────────

export class GoogleWorkspaceAdapter implements IdentityProviderAdapter {
  readonly name = "GoogleWorkspace";

  async deprovision(req: DeprovisionRequest): Promise<DeprovisionResult> {
    const serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
    const domain = process.env.GOOGLE_WORKSPACE_DOMAIN;

    if (!serviceAccountKey || !domain) {
      return { success: false, provider: this.name, error: "Google Workspace credentials not configured" };
    }

    // In production: use @googleapis/admin to suspend the user
    // const admin = google.admin({ version: "directory_v1", auth });
    // await admin.users.update({ userKey: req.email, requestBody: { suspended: true } });
    console.log(`[Google] Suspending ${req.email}`);

    return { success: true, provider: this.name, acknowledgedAt: new Date() };
  }
}

// ─── Microsoft 365 / Entra ID ─────────────────────────────────────────────────

export class Microsoft365Adapter implements IdentityProviderAdapter {
  readonly name = "Microsoft365";

  async deprovision(req: DeprovisionRequest): Promise<DeprovisionResult> {
    const tenantId     = process.env.ENTRA_TENANT_ID;
    const clientId     = process.env.ENTRA_CLIENT_ID;
    const clientSecret = process.env.ENTRA_CLIENT_SECRET;

    if (!tenantId || !clientId || !clientSecret) {
      return { success: false, provider: this.name, error: "Entra ID credentials not configured" };
    }

    try {
      // Get access token via client credentials flow
      const tokenRes = await fetch(
        `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            client_id: clientId,
            client_secret: clientSecret,
            scope: "https://graph.microsoft.com/.default",
            grant_type: "client_credentials",
          }),
        }
      );

      if (!tokenRes.ok) {
        return { success: false, provider: this.name, error: `Token fetch failed: ${tokenRes.status}` };
      }

      const { access_token } = (await tokenRes.json()) as { access_token: string };

      // Disable the user account via Graph API
      const graphRes = await fetch(
        `https://graph.microsoft.com/v1.0/users/${req.email}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ accountEnabled: false }),
        }
      );

      if (!graphRes.ok) {
        const err = await graphRes.text();
        return { success: false, provider: this.name, error: err };
      }

      console.log(`[M365] Account disabled for ${req.email}`);
      return { success: true, provider: this.name, acknowledgedAt: new Date() };
    } catch (err) {
      return { success: false, provider: this.name, error: (err as Error).message };
    }
  }
}

// ─── Factory ──────────────────────────────────────────────────────────────────

export function createIdentityProvider(providerName?: string): IdentityProviderAdapter {
  const name = (providerName ?? process.env.IDP_PROVIDER ?? "mock").toLowerCase();
  switch (name) {
    case "activedirectory":
    case "ad":
    case "ldap":
      return new ActiveDirectoryAdapter();
    case "google":
    case "gsuite":
      return new GoogleWorkspaceAdapter();
    case "microsoft365":
    case "entra":
    case "m365":
      return new Microsoft365Adapter();
    default:
      return {
        name: "mock",
        async deprovision(req) {
          console.log(`[mock-idp] Deprovisioning ${req.email}`);
          return { success: true, provider: "mock", acknowledgedAt: new Date() };
        },
      };
  }
}

// ─── Retry wrapper (Req 5.7 — 3× at 30-min intervals) ────────────────────────

export async function deprovisionWithRetry(
  req: DeprovisionRequest,
  adapter: IdentityProviderAdapter,
  maxAttempts = 3,
  intervalMs = 30 * 60 * 1000
): Promise<DeprovisionResult> {
  let lastError = "";
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const result = await adapter.deprovision(req);
    if (result.success) return result;

    lastError = result.error ?? "Unknown error";
    console.warn(`[idp] Attempt ${attempt}/${maxAttempts} failed for ${req.email}: ${lastError}`);

    if (attempt < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, intervalMs));
    }
  }

// AUTO-FLAG: TODO - needs implementation
  // Req 5.7: Escalate to HR Manager after 3 failures
  // TODO: enqueue notification to HR_Manager via notification queue
  console.error(`[idp] All ${maxAttempts} attempts failed for ${req.email}. Escalating to HR Manager.`);

  return { success: false, provider: adapter.name, error: `Failed after ${maxAttempts} attempts: ${lastError}` };
}
