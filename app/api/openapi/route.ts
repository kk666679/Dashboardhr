/**
 * OpenAPI 3.1 auto-generated spec — Design doc requirement
 * Exposes all tRPC procedures as a REST spec for external integrations.
 */

import { NextResponse } from "next/server";
import type { AppRouter } from "@/server/root";

export async function GET() {
  // Lightweight OpenAPI spec — in production use trpc-openapi for full generation
  const spec = {
    openapi: "3.1.0",
    info: {
      title: "Enterprise HCM API",
      version: "1.0.0",
      description: "Enterprise Human Capital Management System — REST API surface for external integrations",
    },
    servers: [
      { url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000", description: "HCM Platform" },
    ],
    security: [{ bearerAuth: [] }],
    components: {
      securitySchemes: {
        bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
      },
    },
    paths: {
      "/api/auth/login": {
        post: {
          summary: "Local credential login",
          tags: ["Auth"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { type: "object", required: ["email", "password"],
                  properties: { email: { type: "string" }, password: { type: "string" } } },
              },
            },
          },
          responses: {
            "200": { description: "Session cookie set" },
            "401": { description: "Invalid credentials" },
          },
        },
      },
      "/api/auth/mfa": {
        post: {
          summary: "MFA verification (TOTP / SMS)",
          tags: ["Auth"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["tempToken", "method", "code"],
                  properties: {
                    tempToken: { type: "string" },
                    method: { type: "string", enum: ["totp", "sms", "webauthn"] },
                    code: { type: "string" },
                  },
                },
              },
            },
          },
          responses: { "200": { description: "Full session issued" }, "401": { description: "Invalid code" } },
        },
      },
      "/api/webhooks/biometric": {
        post: {
          summary: "Biometric attendance clock-in event",
          tags: ["Webhooks"],
          security: [{ hmac: [] }],
          responses: { "202": { description: "Accepted" }, "401": { description: "Invalid signature" } },
        },
      },
      "/api/webhooks/background-check": {
        post: {
          summary: "Background check result callback",
          tags: ["Webhooks"],
          responses: { "200": { description: "Processed" }, "404": { description: "Candidate not found" } },
        },
      },
      "/api/trpc/{procedure}": {
        post: {
          summary: "tRPC procedure call",
          tags: ["tRPC"],
          parameters: [{ name: "procedure", in: "path", required: true, schema: { type: "string" } }],
          description: "All tRPC procedures are available via POST to /api/trpc/{routerName}.{procedureName}",
          responses: { "200": { description: "tRPC response" } },
        },
      },
    },
    tags: [
      { name: "Auth",     description: "Authentication and MFA" },
      { name: "Webhooks", description: "External system callbacks" },
      { name: "tRPC",     description: "Type-safe API procedures" },
    ],
  };

  return NextResponse.json(spec, {
    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
  });
}
