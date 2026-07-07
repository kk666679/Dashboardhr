export interface DomainEvent {
  type: string;
  occurredAt: Date;
  aggregateId?: string;
  tenantId?: string;
  metadata?: Record<string, unknown>;
}
