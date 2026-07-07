import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const sop = await prisma.sop.findUnique({
      where: { id },
      include: {
        versions: {
          include: {
            risks: true,
            complianceItems: true,
            artifacts: true,
            approvals: true,
            auditEvents: true,
          },
          orderBy: { version: "desc" },
        },
        approvals: true,
        auditEvents: {
          orderBy: { createdAt: "desc" },
          take: 50,
        },
      },
    });

    if (!sop) {
      return NextResponse.json({ error: "SOP not found" }, { status: 404 });
    }

    return NextResponse.json(sop);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    const updated = await prisma.sop.update({
      where: { id },
      data: body,
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    await prisma.sop.delete({ where: { id } });
    return NextResponse.json({ message: "SOP deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}

