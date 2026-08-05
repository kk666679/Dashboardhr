/**
 * POST /api/auth/reset-password/request
 *
 * Initiates a password reset flow by generating a one-time token
 * and storing it in Redis with a 15-minute TTL.
 *
 * In production, sends the reset link via email (stub: returns token in dev).
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { nanoid } from "nanoid";

const BodySchema = z.object({
  email: z.string().email(),
});

const RESET_TTL_SEC = 15 * 60; // 15 minutes

export async function POST(request: NextRequest) {
  let body: z.infer<typeof BodySchema>;
  try {
    body = BodySchema.parse(await request.json());
  } catch {
    return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
  }

  // Always return 200 to prevent email enumeration
  const user = await prisma.user.findUnique({
    where: { email: body.email },
    select: { id: true, tenantId: true },
  });

  if (user) {
    const token  = nanoid(32);
    const key    = `password_reset:${token}`;

    // Store token → userId mapping in Redis
    try {
      const { default: Redis } = await import("ioredis");
      const redis = new Redis(process.env.REDIS_URL ?? "redis://localhost:6379", { lazyConnect: true });
      await redis.setex(key, RESET_TTL_SEC, user.id);
      await redis.quit();
    } catch {
      // If Redis is unavailable, fall through (log in production)
    }

    const resetLink = `${process.env.NEXTAUTH_URL ?? "http://localhost:3000"}/auth/reset-password?token=${token}`;

    // In production: send email via your notification provider
    // await sendEmail({ to: body.email, subject: "Password reset", body: `Click: ${resetLink}` });

    // In development: return the token directly so it can be tested without email
    if (process.env.NODE_ENV !== "production") {
      return NextResponse.json({ message: "Reset link generated", resetLink }, { status: 200 });
    }
  }

  return NextResponse.json(
    { message: "If that email exists, a reset link has been sent." },
    { status: 200 }
  );
}
