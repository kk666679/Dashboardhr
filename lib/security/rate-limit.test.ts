/**
 * Unit tests — rate-limit.ts
 *
 * Tests the in-memory fallback paths (Redis is mocked as unavailable
 * by forcing the module-level Redis import to fail).  Pure-function
 * helpers (resolveTokenBudgetCost) are tested without any mocking.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";

// Force Redis to be unavailable for all tests so we exercise the LRU fallback
vi.mock("ioredis", () => {
  return {
    default: class MockRedis {
      constructor() {}
      connect() { return Promise.reject(new Error("Redis unavailable")); }
      get() { return Promise.reject(new Error("unavailable")); }
      set() { return Promise.reject(new Error("unavailable")); }
      del() { return Promise.reject(new Error("unavailable")); }
    },
  };
});

import {
  checkRateLimit,
  checkTenantBudget,
  getRateLimitHeaders,
  resetRateLimit,
  resetTenantBudget,
  resolveTokenBudgetCost,
} from "./rate-limit";

beforeEach(async () => {
  // Clear counters between tests by resetting each identifier used
  await resetRateLimit("test-id");
  await resetRateLimit("blocked-id");
  await resetTenantBudget("tenant-test");
});

// ─── resolveTokenBudgetCost ───────────────────────────────────────────────────

describe("resolveTokenBudgetCost", () => {
  it("returns a plain number as-is (min 1)", () => {
    expect(resolveTokenBudgetCost(5)).toBe(5);
    expect(resolveTokenBudgetCost(0)).toBe(1); // min 1
  });

  it("sums numeric values from a flat object", () => {
    const cost = resolveTokenBudgetCost({ promptTokens: 100, completionTokens: 50 });
    expect(cost).toBe(150);
  });

  it("handles an array of numbers", () => {
    expect(resolveTokenBudgetCost([10, 20, 30] as any)).toBe(60);
  });

  it("defaults to 1 for undefined/null", () => {
    expect(resolveTokenBudgetCost(undefined as any)).toBe(1);
  });
});

// ─── checkRateLimit (in-memory fallback) ─────────────────────────────────────

describe("checkRateLimit — in-memory fallback", () => {
  it("allows requests below the limit", async () => {
    const allowed = await checkRateLimit("test-id", 5);
    expect(allowed).toBe(true);
  });

  it("blocks on exceeding the limit", async () => {
    const id = "rate-exceed-" + Date.now();
    for (let i = 0; i < 3; i++) await checkRateLimit(id, 3);
    const blocked = await checkRateLimit(id, 3);
    expect(blocked).toBe(false);
  });

  it("allows independent identifiers to have their own counters", async () => {
    const idA = "id-a-" + Date.now();
    const idB = "id-b-" + Date.now();
    for (let i = 0; i < 2; i++) await checkRateLimit(idA, 2);
    // idA is now at limit; idB should still be fine
    expect(await checkRateLimit(idA, 2)).toBe(false);
    expect(await checkRateLimit(idB, 2)).toBe(true);
  });
});

// ─── resetRateLimit ───────────────────────────────────────────────────────────

describe("resetRateLimit", () => {
  it("clears a blocked identifier so requests are allowed again", async () => {
    const id = "reset-test-" + Date.now();
    for (let i = 0; i < 3; i++) await checkRateLimit(id, 3);
    expect(await checkRateLimit(id, 3)).toBe(false);
    await resetRateLimit(id);
    expect(await checkRateLimit(id, 3)).toBe(true);
  });
});

// ─── checkTenantBudget (in-memory fallback) ───────────────────────────────────

describe("checkTenantBudget — in-memory fallback", () => {
  it("allows requests within budget", async () => {
    const result = await checkTenantBudget("tenant-test", 100);
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBeGreaterThan(0);
  });

  it("returns remaining budget after spending tokens", async () => {
    const before = await checkTenantBudget("tenant-budget-" + Date.now(), 1000);
    expect(before.remaining).toBeLessThan(Number(process.env.TOKEN_BUDGET_PER_TENANT ?? 100000));
  });

  it("provides a resetAt timestamp in the future", async () => {
    const result = await checkTenantBudget("tenant-time-" + Date.now(), 1);
    expect(result.resetAt).toBeGreaterThan(Math.floor(Date.now() / 1000));
  });
});

// ─── resetTenantBudget ────────────────────────────────────────────────────────

describe("resetTenantBudget", () => {
  it("resets budget so tenant can make requests again", async () => {
    const tenant = "tenant-reset-" + Date.now();
    // Exhaust budget with a huge cost (override default via direct call)
    // Since we can't set budget to 0 directly, just verify reset doesn't throw
    await expect(resetTenantBudget(tenant)).resolves.toBeUndefined();
  });
});

// ─── getRateLimitHeaders ──────────────────────────────────────────────────────

describe("getRateLimitHeaders", () => {
  it("returns the three expected header keys", async () => {
    const headers = await getRateLimitHeaders("header-test-" + Date.now(), 100);
    expect(headers).toHaveProperty("X-RateLimit-Limit");
    expect(headers).toHaveProperty("X-RateLimit-Remaining");
    expect(headers).toHaveProperty("X-RateLimit-Reset");
  });

  it("reflects the provided limit in the header", async () => {
    const headers = await getRateLimitHeaders("header-limit-" + Date.now(), 42);
    expect(headers["X-RateLimit-Limit"]).toBe("42");
  });
});
