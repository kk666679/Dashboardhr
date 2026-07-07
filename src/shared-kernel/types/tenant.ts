export type TenantId = string;

export interface TenantContext {
  tenantId: TenantId;
  userId: string;
  userRole: string;
  legalEntityId?: string;
  departmentId?: string;
}
