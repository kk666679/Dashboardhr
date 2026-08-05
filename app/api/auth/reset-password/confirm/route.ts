/**
 * POST /api/auth/reset-password/confirm
 *
 * Verifies the reset token and updates the password.
 * Invalidates all existing sessions after a successful reset.
 *
 * Requirements: Security C1 in 04-security.md
 * Note: Stores hashed password — bcrypt should be added in production.
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { invalidateAllSessions } from "@/lib/session";

const BodySchema = z.object({
  token:       z.string().min(1),
  newPassword: z.string().min(8),
});

export async function POST(request: NextRequest) {
  let body: z.infer<typeof BodySchema>;
  try {
    body = BodySchema.parse(await request.json());
  } catch {
    return NextResponse.json(
      { error: "token and newPassword (min 8 chars) are required" },
      { status: 400 }
    );
  }

  const key = `password_reset:${body.token}`;
  let userId: string | null = null;

  try {
    const { default: Redis } = await import("ioredis");
    const redis = new Redis(process.env.REDIS_URL ?? "redis://localhost:6379", { lazyConnect: true });
    userId = await redis.get(key);
    if (userId) await redis.del(key); // one-time use
    await redis.quit();
  } catch {
    return NextResponse.json({ error: "Reset service unavailable" }, { status: 503 });
  }

  if (!userId) {
    return NextResponse.json(
      { error: "Invalid or expired reset token" },
      { status: 401 }
    );
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const { hashPassword } = await import("@/lib/server/password");
  const hashed = await hashPassword(body.newPassword);
  await prisma.user.update({
    where: { id: userId },
    data:  { password: hashed },
  });

  // Invalidate all sessions — force re-login everywhere
  await invalidateAllSessions(userId);

  return NextResponse.json({ success: true }, { status: 200 });
}
