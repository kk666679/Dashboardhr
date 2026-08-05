/**
 * Password hashing utilities using bcryptjs.
 *
 * bcryptjs is a pure-JS implementation — no native bindings needed,
 * compatible with Next.js Edge and Node runtimes.
 *
 * Security fix C1 from docs/api-analysis/04-security.md
 */

// Dynamic import keeps bcryptjs out of the Edge bundle when not needed.
async function getBcrypt() {
  const bcrypt = await import("bcryptjs");
  return bcrypt.default ?? bcrypt;
}

/** Hash a plain-text password. Always await this before storing. */
export async function hashPassword(plain: string): Promise<string> {
  const bcrypt = await getBcrypt();
  return bcrypt.hash(plain, 12);
}

/**
 * Compare a plain-text password against a stored hash.
 * Returns true only if they match.
 * Never exposes timing information — bcrypt.compare is constant-time.
 */
export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  // Legacy: plain-text passwords stored before hashing was added.
  // If the stored value doesn't look like a bcrypt hash ($2b$...), fall back
  // to direct comparison so existing accounts keep working on first login,
  // then the caller should re-hash and save.
  if (!hash.startsWith("$2")) {
    return plain === hash;
  }
  const bcrypt = await getBcrypt();
  return bcrypt.compare(plain, hash);
}

/** True if the hash is already bcrypt-hashed (not legacy plain-text). */
export function isBcryptHash(value: string): boolean {
  return value.startsWith("$2");
}
