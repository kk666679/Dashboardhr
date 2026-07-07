/**
 * BullMQ domain event publisher.
 *
 * Implements the EventBus interface from the shared kernel.
 * Events are enqueued to the `domain-events` BullMQ queue so workers
 * can subscribe and react asynchronously.
 */

import { Queue } from "bullmq";
import type { EventBus } from "@/src/shared-kernel/events/event-bus";
import type { DomainEvent } from "@/src/shared-kernel/events/domain-event";

const REDIS_URL = process.env.REDIS_URL ?? "redis://localhost:6379";

const domainEventQueue = new Queue("domain-events", {
  connection: { host: new URL(REDIS_URL).hostname, port: Number(new URL(REDIS_URL).port) || 6379 },
});

const handlers = new Map<string, Array<(event: DomainEvent) => Promise<void> | void>>();

export const bullmqEventBus: EventBus = {
  async publish(event: DomainEvent): Promise<void> {
    await domainEventQueue.add(event.type, event, {
      removeOnComplete: 1000,
      removeOnFail: 500,
    });
  },

  async subscribe<T extends DomainEvent>(
    type: string,
    handler: (event: T) => Promise<void> | void
  ): Promise<void> {
    const list = handlers.get(type) ?? [];
    list.push(handler as (event: DomainEvent) => Promise<void> | void);
    handlers.set(type, list);
  },
};
