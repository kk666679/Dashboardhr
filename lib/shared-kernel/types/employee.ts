export type EmployeeId = string;

export interface EmployeeRef {
  id: EmployeeId;
  tenantId: string;
  name: string;
  email?: string | null;
}
