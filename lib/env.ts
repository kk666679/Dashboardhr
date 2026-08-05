import { z } from 'zod';

// NOTE: This app uses a custom Redis session store + JWT_SECRET for auth —
// NOT NextAuth.  NEXTAUTH_SECRET / NEXTAUTH_URL are therefore not validated
// here.  If you add NextAuth in the future, uncomment those fields.
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // Database — ORM_PRISMA_URL takes precedence (Prisma Accelerate / Neon),
  // falling back to DATABASE_URL for local Docker Compose.
  DATABASE_URL: z.string().optional(),
  ORM_PRISMA_URL: z.string().optional(),

  // Redis session store + BullMQ
  REDIS_URL: z.string().default('redis://localhost:6379'),

  // JWT for inter-service tokens (lib/session/index.ts)
  JWT_SECRET: z.string().default('dev-secret-replace-in-production-min-32-chars'),

  // AI Services
  OPENAI_API_KEY: z.string().optional(),
  ANTHROPIC_API_KEY: z.string().optional(),
  OLLAMA_API_URL: z.string().url().optional(),

  // File Upload
  UPLOAD_DIR: z.string().default('./uploads'),
  MAX_FILE_SIZE: z.coerce.number().default(10_485_760), // 10 MB

  // Security
  CORS_ALLOWED_ORIGINS: z.string().default('http://localhost:3000'),
  RATE_LIMIT_REQUESTS: z.coerce.number().default(100),
}).refine(
  (data) => !!(data.ORM_PRISMA_URL ?? data.DATABASE_URL),
  {
    message: 'Either DATABASE_URL or ORM_PRISMA_URL must be provided',
    path: ['DATABASE_URL'],
  }
);

// Parse lazily so the module can be imported during `next build` without
// crashing when optional env vars are absent in CI.  Only validate eagerly
// in server runtime.
let _env: z.infer<typeof envSchema> | null = null;

function parseEnv() {
  if (_env) return _env;
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    // Only hard-crash in production; in dev/CI print a warning and continue.
    if (process.env.NODE_ENV === 'production') {
      console.error('❌ Invalid environment variables:', result.error.flatten());
      process.exit(1);
    }
    console.warn('⚠️  Environment variable issues (non-fatal in dev):', result.error.flatten());
    // Return a best-effort partial parse so the server can still start
    _env = envSchema.parse({ ...process.env, DATABASE_URL: process.env.DATABASE_URL ?? 'postgresql://localhost/dev' });
    return _env;
  }
  _env = result.data;
  return _env;
}

export const env = new Proxy({} as z.infer<typeof envSchema>, {
  get(_target, prop) {
    return (parseEnv() as any)[prop];
  },
});

/** Explicitly validate all env vars and throw/exit on failure. */
export function validateEnv(): void {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    console.error('❌ Invalid environment variables:', result.error.flatten());
    process.exit(1);
  }
}
