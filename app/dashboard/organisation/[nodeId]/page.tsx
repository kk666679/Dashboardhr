import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function NodeDetailPage({ params }: { params: Promise<{ nodeId: string }> }) {
  const { nodeId } = await params;
  const node = await prisma.orgNode.findUnique({ where: { id: nodeId } });

  if (!node) notFound();

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-semibold">{node.name}</h1>
      <p className="text-sm text-muted-foreground">Level: {node.level}</p>
      <p className="text-sm text-muted-foreground">Status: {node.isActive ? "Active" : "Inactive"}</p>
    </div>
  );
}
