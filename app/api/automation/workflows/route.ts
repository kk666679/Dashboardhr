/**
 * REST /api/automation/workflows
 *
 * Workflow definition CRUD — auth-guarded, tenant-scoped, DB-backed.
 * Replaces the previous in-memory store (lost on restart).
 *
 * GET    /api/automation/workflows           — list definitions for tenant
 * POST   /api/automation/workflows           — create new definition
 * PUT    /api/automation/workflows?id=...    — update definition
 * DELETE /api/automation/workflows?id=...    — soft-delete definition
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentSession } from "@/lib/server/auth";
import { prisma } from "@/lib/prisma";

// ─── Zod schemas ──────────────────────────────────────────────────────────────

const CreateSchema = z.object({
  name:     z.string().min(1).max(200),
  module:   z.string().min(1).max(100).default("custom"),
  graphJson: z.object({
    nodes: z.array(z.any()),
    edges: z.array(z.any()),
  }),
  slaConfig:  z.record(z.string(), z.any()).optional(),
  isActive:   z.boolean().default(false),
  templateId: z.string().optional(),
});

const UpdateSchema = CreateSchema.partial().extend({
  isActive: z.boolean().optional(),
});

// ─── GET — list ───────────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const module   = searchParams.get("module") ?? undefined;
  const isActive = searchParams.has("isActive")
    ? searchParams.get("isActive") === "true"
    : undefined;
  const take = Math.min(Number(searchParams.get("take") ?? 50), 200);
  const skip = Number(searchParams.get("skip") ?? 0);

  try {
    const workflows = await prisma.workflowDefinition.findMany({
      where: {
        tenantId: session.tenantId,
        ...(module    ? { module }    : {}),
        ...(isActive !== undefined ? { isActive } : {}),
      },
      orderBy: [{ name: "asc" }, { version: "desc" }],
      take,
      skip,
      select: {
        id:        true,
        name:      true,
        module:    true,
        version:   true,
        isActive:  true,
        createdAt: true,
        updatedAt: true,
        // Omit graphJson to keep response lean
      },
    });
    return NextResponse.json({ workflows, total: workflows.length });
  } catch (error) {
    console.error("[workflows GET]", error);
    return NextResponse.json({ error: "Failed to list workflows" }, { status: 500 });
  }
}

// ─── POST — create ────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: z.infer<typeof CreateSchema>;
  try {
    body = CreateSchema.parse(await request.json());
  } catch (e) {
    if (e instanceof z.ZodError) return NextResponse.json({ error: e.flatten() }, { status: 400 });
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  try {
    // Auto-version: find latest version for this name + tenant
    const latest = await prisma.workflowDefinition.findFirst({
      where:   { tenantId: session.tenantId, name: body.name },
      orderBy: { version: "desc" },
      select:  { version: true },
    });
    const version = (latest?.version ?? 0) + 1;

    const workflow = await prisma.workflowDefinition.create({
      data: {
        tenantId:  session.tenantId,
        name:      body.name,
        module:    body.module,
        graphJson: body.graphJson as any,
        slaConfig: (body.slaConfig ?? {}) as any,
        isActive:  body.isActive,
        version,
      },
    });
    return NextResponse.json({ workflow }, { status: 201 });
  } catch (error) {
    console.error("[workflows POST]", error);
    return NextResponse.json({ error: "Failed to create workflow" }, { status: 500 });
  }
}

// ─── PUT — update ─────────────────────────────────────────────────────────────

export async function PUT(request: NextRequest) {
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = new URL(request.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing workflow id" }, { status: 400 });

  let body: z.infer<typeof UpdateSchema>;
  try {
    body = UpdateSchema.parse(await request.json());
  } catch (e) {
    if (e instanceof z.ZodError) return NextResponse.json({ error: e.flatten() }, { status: 400 });
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  try {
    const existing = await prisma.workflowDefinition.findFirst({
      where: { id, tenantId: session.tenantId },
    });
    if (!existing) return NextResponse.json({ error: "Workflow not found" }, { status: 404 });

    const workflow = await prisma.workflowDefinition.update({
      where: { id },
      data: {
        ...(body.name      ? { name: body.name }           : {}),
        ...(body.module    ? { module: body.module }       : {}),
        ...(body.graphJson ? { graphJson: body.graphJson as any } : {}),
        ...(body.slaConfig ? { slaConfig: body.slaConfig as any } : {}),
        ...(body.isActive !== undefined ? { isActive: body.isActive } : {}),
      },
    });
    return NextResponse.json({ workflow });
  } catch (error) {
    console.error("[workflows PUT]", error);
    return NextResponse.json({ error: "Failed to update workflow" }, { status: 500 });
  }
}

// ─── DELETE ───────────────────────────────────────────────────────────────────

export async function DELETE(request: NextRequest) {
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = new URL(request.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing workflow id" }, { status: 400 });

  try {
    const existing = await prisma.workflowDefinition.findFirst({
      where: { id, tenantId: session.tenantId },
    });
    if (!existing) return NextResponse.json({ error: "Workflow not found" }, { status: 404 });

    // Soft-delete by deactivating rather than hard-deleting (preserves history)
    await prisma.workflowDefinition.update({
      where: { id },
      data:  { isActive: false },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[workflows DELETE]", error);
    return NextResponse.json({ error: "Failed to delete workflow" }, { status: 500 });
  }
}
