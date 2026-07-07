import type { DomainEvent } from "./domain-event";

export interface EventBus {
  publish(event: DomainEvent): Promise<void>;
  subscribe<T extends DomainEvent>(type: string, handler: (event: T) => Promise<void> | void): Promise<void>;
}
