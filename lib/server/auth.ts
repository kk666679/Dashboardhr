import "server-only";

import { cookies } from "next/headers";
import type { SessionPayload } from "@/lib/session";

const SESSION_COOKIE_NAME = "__session";

/** Returns the authenticated session represented by the request cookie. */
export async function getCurrentSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionId) return null;

  const { getSession } = await import("@/lib/session");
  return getSession(sessionId);
}
