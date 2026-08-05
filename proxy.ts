import { NextRequest, NextResponse } from "next/server";
import {
  LOCALES,
  DEFAULT_LOCALE,
  isValidLocale,
  isRtl,
  getLocaleDir,
  LOCALE_LABELS,
} from "@/i18n/config";

// Using LOCALES from config instead of hardcoded array
const locales = [...LOCALES];
const defaultLocale = DEFAULT_LOCALE;

// Public paths that don't require authentication
const PUBLIC_PATHS = [
  "/api/auth",
  "/api/public",
  "/api/health",
  "/",
  "/login",
  "/register",
  "/_next",
  "/favicon.ico",
];

// Admin-only paths
const ADMIN_PATHS = ["/api/admin", "/api/system"];

// Locale-specific cookie names for persistence
const LOCALE_COOKIE = "locale";

interface ServiceToken {
  userId: string;
  role: string;
  tenantId: string;
}

interface TenantBudget {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

interface MiddlewareDependencies {
  verifyServiceToken: (token: string) => Promise<ServiceToken | null>;
  checkRateLimit: (identifier: string, limit?: number) => Promise<boolean>;
  getRateLimitHeaders: (
    identifier: string,
    limit?: number
  ) => Promise<Record<string, string>>;
  checkTenantBudget: (tenantId: string, cost?: unknown) => Promise<TenantBudget>;
  resolveTokenBudgetCost: (cost: unknown) => number;
}

async function getMiddlewareDependencies(): Promise<MiddlewareDependencies> {
  try {
    const [{ verifyServiceToken }, rateLimitModule] = await Promise.all([
      import("./lib/session"),
      import("./lib/security/rate-limit"),
    ]);

    return {
      verifyServiceToken,
      checkRateLimit: rateLimitModule.checkRateLimit,
      getRateLimitHeaders: rateLimitModule.getRateLimitHeaders,
      checkTenantBudget: (tenantId: string, cost?: unknown) =>
        rateLimitModule.checkTenantBudget(
          tenantId,
          cost as Parameters<typeof rateLimitModule.checkTenantBudget>[1]
        ),
      resolveTokenBudgetCost: (cost: unknown) =>
        rateLimitModule.resolveTokenBudgetCost(
          cost as Parameters<typeof rateLimitModule.resolveTokenBudgetCost>[0]
        ),
    };
  } catch {
    return {
      verifyServiceToken: async () => null,
      checkRateLimit: async () => true,
      getRateLimitHeaders: async () => ({}),
      checkTenantBudget: async () => ({ allowed: true, remaining: 0, resetAt: 0 }),
      resolveTokenBudgetCost: (cost: unknown) =>
        typeof cost === "number" ? Math.max(1, Math.ceil(cost)) : 1,
    };
  }
}

function getRequestTokenCost(
  request: NextRequest,
  resolveTokenBudgetCost: (cost: unknown) => number
): number {
  const explicitCost = Number(request.headers.get("x-token-cost"));
  if (Number.isFinite(explicitCost) && explicitCost > 0) {
    return resolveTokenBudgetCost(explicitCost);
  }

  const usageHeader = request.headers.get("x-token-usage");
  if (!usageHeader) return 1;

  try {
    return resolveTokenBudgetCost(JSON.parse(usageHeader));
  } catch {
    return 1;
  }
}

// Next.js proxy (formerly middleware) — runs on every matched request before page/API handlers.
// 1. Rate limiting (CWE-400)
// 2. Security headers (CWE-451, CWE-200)
// 3. CSRF protection (CWE-352)
// 4. Authentication & authorization (CWE-285)
// 5. Locale detection & persistence

export async function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const dependencies = await getMiddlewareDependencies();

// --------------------------------------------------------------------------
  // 1. Rate Limiting (CWE-400)
  // --------------------------------------------------------------------------
  const ip = request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip") ?? "unknown";
  const rateLimitKey = `${ip}:${pathname}`;

  const [rateAllowed, initialRateHeaders] = await Promise.all([
    dependencies.checkRateLimit(rateLimitKey, 100),
    dependencies.getRateLimitHeaders(rateLimitKey),
  ]);

  if (!rateAllowed) {
    return new NextResponse(JSON.stringify({ error: "Too many requests" }), {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": "60",
        ...initialRateHeaders,
      },
    });
  }

  // --------------------------------------------------------------------------
  // 2. Security Headers (CWE-451, CWE-200)
  // --------------------------------------------------------------------------
  const response = NextResponse.next();

  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=(), usb=()"
  );

  if (process.env.NODE_ENV === "production") {
    response.headers.set(
      "Content-Security-Policy",
      [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.aifwms.xyz",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: https://www.aifwms.xyz https://aifwms.xyz",
        "font-src 'self'",
        "connect-src 'self' https://www.aifwms.xyz https://aifwms.xyz https://api.openai.com https://api.anthropic.com",
        "frame-ancestors 'none'",
      ].join("; ")
    );
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains; preload"
    );
  }

  response.headers.delete("X-Powered-By");

  // --------------------------------------------------------------------------
  // 3. CSRF Protection (CWE-352) — only for state-changing methods
  // --------------------------------------------------------------------------
  if (["POST", "PUT", "DELETE", "PATCH"].includes(request.method)) {
    const csrfToken = request.headers.get("X-CSRF-Token");
    const sessionToken = request.cookies.get("csrf-token")?.value;
    const isPublicPath = PUBLIC_PATHS.some((p) => pathname.startsWith(p));

    if (!isPublicPath && (!csrfToken || csrfToken !== sessionToken)) {
      return new NextResponse(
        JSON.stringify({ error: "Invalid CSRF token" }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }
  }

  // --------------------------------------------------------------------------
  // 4. Authentication & Authorization (CWE-285)
  // --------------------------------------------------------------------------
  const isPublicPath = PUBLIC_PATHS.some((p) => pathname.startsWith(p));
  const isAdminPath = ADMIN_PATHS.some((p) => pathname.startsWith(p));
  let authenticatedTenantId: string | null = null;
  let tenantBudget: TenantBudget | null = null;

  if (!isPublicPath) {
    const authHeader = request.headers.get("authorization") ?? "";
    const bearerToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
    const sessionId = bearerToken ?? request.cookies.get("session-id")?.value ?? null;
    const token = sessionId ? await dependencies.verifyServiceToken(sessionId) : null;

    if (!token) {
      if (pathname.startsWith("/api")) {
        return new NextResponse(
          JSON.stringify({ error: "Unauthorized" }),
          { status: 401, headers: { "Content-Type": "application/json" } }
        );
      }
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    authenticatedTenantId = token.tenantId;

    if (isAdminPath && token.role !== "ADMIN") {
      return new NextResponse(
        JSON.stringify({ error: "Forbidden - Admin access required" }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    tenantBudget = await dependencies.checkTenantBudget(
      token.tenantId,
      getRequestTokenCost(request, dependencies.resolveTokenBudgetCost),
    );
    if (!tenantBudget.allowed) {
      return new NextResponse(JSON.stringify({ error: "Tenant token budget exceeded" }), {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": String(Math.max(1, tenantBudget.resetAt - Math.floor(Date.now() / 1000))),
          "X-Tenant-Budget-Remaining": "0",
          "X-Tenant-Budget-Reset": String(tenantBudget.resetAt),
        },
      });
    }
  }

  // --------------------------------------------------------------------------
  // 5. API routes are handled by Next.js route handlers directly — no rewrite needed
  // --------------------------------------------------------------------------

  // --------------------------------------------------------------------------
  // 6. Enhanced Locale Detection & Persistence
  // --------------------------------------------------------------------------
  if (
    !pathname.startsWith("/api") &&
    !pathname.startsWith("/_next") &&
    !pathname.startsWith("/static")
  ) {
    // Priority 1: Check if locale is in URL path
    let detectedLocale: string | null = null;
    let pathnameWithoutLocale = pathname;

    // Check if path starts with a valid locale
    for (const locale of locales) {
      if (pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`) {
        detectedLocale = locale;
        pathnameWithoutLocale = pathname.replace(`/${locale}`, "") || "/";
        break;
      }
    }

    // Priority 2: Check query parameter
    if (!detectedLocale) {
      const queryLocale = searchParams.get("lang") || searchParams.get("locale");
      if (queryLocale && isValidLocale(queryLocale)) {
        detectedLocale = queryLocale;
      }
    }

    // Priority 3: Check cookie
    if (!detectedLocale) {
      const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;
      if (cookieLocale && isValidLocale(cookieLocale)) {
        detectedLocale = cookieLocale;
      }
    }

    // Priority 4: Check Accept-Language header
    if (!detectedLocale) {
      const acceptLanguage = request.headers.get("accept-language");
      if (acceptLanguage) {
        const preferredLocales = acceptLanguage
          .split(",")
          .map((lang) => lang.split(";")[0].trim().toLowerCase())
          .filter(Boolean);

        for (const preferred of preferredLocales) {
          // Check exact match
          if (isValidLocale(preferred)) {
            detectedLocale = preferred;
            break;
          }
          // Check if locale matches start (e.g., "en" matches "en-US")
          const match = locales.find((l) => preferred.startsWith(l));
          if (match) {
            detectedLocale = match;
            break;
          }
        }
      }
    }

    // Priority 5: Use default locale as fallback
    if (!detectedLocale) {
      detectedLocale = defaultLocale;
    }

    // Ensure detected locale is valid
    if (!isValidLocale(detectedLocale)) {
      detectedLocale = defaultLocale;
    }

    // Redirect to include locale if not present in URL
    if (detectedLocale && !pathname.startsWith(`/${detectedLocale}`) && pathname !== "/") {
      const url = request.nextUrl.clone();
      url.pathname = `/${detectedLocale}${pathname === "/" ? "" : pathname}`;
      url.searchParams.delete("lang");
      url.searchParams.delete("locale");
      
      // Set locale cookie for persistence
      const redirectResponse = NextResponse.redirect(url);
      redirectResponse.cookies.set(LOCALE_COOKIE, detectedLocale, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      });
      
      // Add locale metadata to response headers
      redirectResponse.headers.set("x-locale", detectedLocale);
      redirectResponse.headers.set("x-locale-dir", getLocaleDir(detectedLocale));
      
      return redirectResponse;
    }

    // Set locale in response headers for downstream use
    if (detectedLocale) {
      response.headers.set("x-locale", detectedLocale);
      response.headers.set("x-locale-dir", getLocaleDir(detectedLocale));
      
      // Set or refresh locale cookie
      if (!request.cookies.get(LOCALE_COOKIE)?.value) {
        response.cookies.set(LOCALE_COOKIE, detectedLocale, {
          maxAge: 60 * 60 * 24 * 30,
          path: "/",
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
        });
      }
    }
  }

// --------------------------------------------------------------------------
  // 7. Apply rate limit & per-tenant budget headers to the final response
  // --------------------------------------------------------------------------
  const finalRateHeaders = await dependencies.getRateLimitHeaders(rateLimitKey);
  Object.entries(finalRateHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  if (authenticatedTenantId && tenantBudget) {
    response.headers.set("X-Tenant-Budget-Remaining", String(tenantBudget.remaining));
    response.headers.set("X-Tenant-Budget-Reset", String(tenantBudget.resetAt));
  }

  return response;
}

export const config = {
  matcher: [
    "/api/:path*",
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
