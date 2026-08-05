export type IntegrationStatus =
  | "connected"
  | "available"
  | "coming_soon"
  | "disabled";

export type ApiStatus = "operational" | "degraded" | "down" | "unknown";

export interface IntegrationDefinition {
  id: string;
  category:
    | "HRIS"
    | "PAYROLL"
    | "PROGRESS"
    | "SECURITY"
    | "IDENTITY"
    | "STORAGE"
    | "FINANCE"
    | "AI"
    | "GOV_HR"
    | "GOV_SAFETY"
    | "GOV_CORPORATE"
    | "GOV_IMMIGRATION"
    | "GOV_FINANCE"
    | "GOV_PAYROLL"
    | "GOV_HRIS"
    | "GOV_PRODUCTIVITY"
    | "GOV_IDENTITY"
    | "GOV_STORAGE";
  logo?: {
    type: "public_asset";
    src: string;
    alt: string;
  };
  provider: string;
  platformName: string;
  description: string;

  status: IntegrationStatus;
  apiEndpoint?: string;

  documentationUrl?: string;
  permissions: {
    requiredRoleModules: string[]; // module names used by ABAC evaluator
    actions: Array<"read" | "write" | "approve" | "delete">;
  };

  supportsWebhook: boolean;
  supportsOAuth: boolean;
  supportsSync: boolean;
}

