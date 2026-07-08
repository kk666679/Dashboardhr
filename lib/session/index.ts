/**
 * Session management with Redis store — Task 3.2
 *
 * Stores session { userId, role, tenantId, legalEntityId, departments }
 * Idle timeout: 30 min for HR roles, 60 min for Employees
 * Absolute expiry: 8 hours
 * Session invalidated on password change or security event
 *
 * Requirements: 28.5
 */

import Redis from "ioredis";
import { SignJWT, jwtVerify } from "jose";
import type { HCMRole } from "@/src/shared-kernel/security/permission-types";
import { MFA_REQUIRED_ROLES } from "@/src/shared-kernel/security/permission-types";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SessionPayload {
  userId: string;
  role: HCMRole | string;
  tenantId: string;
  employeeId?: string;
  legalEntityId?: string;
  departments?: string[];
  legalEntities?: string[];
  mfaVerified?: boolean;
  createdAt: number;
  lastActiveAt: number;
}

// ─── Redis client ─────────────────────────────────────────────────────────────

const globalForRedis = globalThis as unknown as { redis: Redis | undefined };

function getRedis() {
  if (globalForRedis.redis) return globalForRedis.redis;
  const client = new Redis(process.env.REDIS_URL ?? "redis://localhost:6379");
  if (process.env.NODE_ENV !== "production") globalForRedis.redis = client;
  return client;
}

// ─── Timeout config ───────────────────────────────────────────────────────────

const HR_ROLES: (HCMRole | string)[] = [
  "Super_Admin", "Group_HR", "HR_Director", "HR_Manager", "HR_Executive",
  "Payroll_Manager", "Payroll_Executive", "Finance", "Recruiter",
  "Department_Head", "Manager", "Compliance_Officer", "Auditor", "ADMIN", "HR",
];

const ABSOLUTE_TTL_SEC = 8 * 60 * 60; // 8 hours
const HR_IDLE_TTL_SEC  = 30 * 60;     // 30 minutes
const EMP_IDLE_TTL_SEC = 60 * 60;     // 60 minutes

function idleTtl(role: string): number {
  return HR_ROLES.includes(role as HCMRole) ? HR_IDLE_TTL_SEC : EMP_IDLE_TTL_SEC;
}

// ─── Session key helpers ──────────────────────────────────────────────────────

const sessionKey = (userId: string) => `session:${userId}`;
const userSessionsKey = (userId: string) => `user_sessions:${userId}`;

// ─── Public API ───────────────────────────────────────────────────────────────

export async function createSession(payload: Omit<SessionPayload, "createdAt" | "lastActiveAt">): Promise<string> {
  const redis = getRedis();
  const now = Date.now();
  const session: SessionPayload = { ...payload, createdAt: now, lastActiveAt: now };

  const sessionId = `${payload.userId}:${now}`;
  const key = sessionKey(sessionId);

  await redis.setex(key, ABSOLUTE_TTL_SEC, JSON.stringify(session));
  // Track all session IDs for this user (for bulk invalidation)
  await redis.sadd(userSessionsKey(payload.userId), sessionId);
  await redis.expire(userSessionsKey(payload.userId), ABSOLUTE_TTL_SEC);

  return sessionId;
}

export async function getSession(sessionId: string): Promise<SessionPayload | null> {
  const redis = getRedis();
  const raw = await redis.get(sessionKey(sessionId));
  if (!raw) return null;

  const session: SessionPayload = JSON.parse(raw);
  const idleSeconds = (Date.now() - session.lastActiveAt) / 1000;

  // Check idle timeout
  if (idleSeconds > idleTtl(session.role)) {
    await deleteSession(sessionId);
    return null;
  }

  // Refresh last active
  session.lastActiveAt = Date.now();
  await redis.setex(sessionKey(sessionId), ABSOLUTE_TTL_SEC, JSON.stringify(session));

  return session;
}

export async function deleteSession(sessionId: string): Promise<void> {
  const redis = getRedis();
  const userId = sessionId.split(":")[0];
  await redis.del(sessionKey(sessionId));
  await redis.srem(userSessionsKey(userId), sessionId);
}

/** Invalidate ALL sessions for a user (password change, security event). Req 28.5 */
export async function invalidateAllSessions(userId: string): Promise<void> {
  const redis = getRedis();
  const sessionIds: string[] = await redis.smembers(userSessionsKey(userId));
  if (sessionIds.length) {
    const keys = sessionIds.map(sessionKey);
    await redis.del(...keys);
  }
  await redis.del(userSessionsKey(userId));
}

// ─── Short-lived RS256 JWT for inter-service calls ────────────────────────────

const JWT_TTL_SEC = 15 * 60; // 15 minutes

async function getJwtSecret(): Promise<Uint8Array> {
  const secret = process.env.JWT_SECRET ?? "dev-secret-replace-in-production-min-32-chars";
  return new TextEncoder().encode(secret);
}

export async function issueServiceToken(payload: {
  userId: string;
  role: string;
  tenantId: string;
}): Promise<string> {
  const secret = await getJwtSecret();
  return new SignJWT({ ...payload, type: "service" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${JWT_TTL_SEC}s`)
    .setIssuer(process.env.JWT_ISSUER ?? "hcm-platform")
    .sign(secret);
}

export async function verifyServiceToken(token: string): Promise<{
  userId: string;
  role: string;
  tenantId: string;
} | null> {
  try {
    const secret = await getJwtSecret();
    const { payload } = await jwtVerify(token, secret);
    return payload as any;
  } catch {
    return null;
  }
}

/** Check if a role requires MFA. Req 28.3 */
export function requiresMfa(role: string): boolean {
  return MFA_REQUIRED_ROLES.includes(role as HCMRole);
}
