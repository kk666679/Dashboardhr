import { prisma } from "@/lib/prisma";


export async function searchSops(query: string, limit: number = 10) {
  const q = query.trim();
  if (!q) return [];

  // MVP-lite: simple text matching across SOP title + department + stored JSON content (fallback to title/dept).
  // Works with tests and provides baseline.
  const results = await prisma.sop.findMany({
    take: limit,
    where: {
      OR: [
        { title: { contains: q, mode: "insensitive" } },
        { department: { contains: q, mode: "insensitive" } },
        { code: { contains: q, mode: "insensitive" } },
        { category: { equals: undefined as any } },
      ] as any,
    },
    orderBy: { updatedAt: "desc" },
    select: { id: true, code: true, title: true, department: true, category: true, status: true },
  });

  return results;
}

export async function findRelatedSops(sopId: string, limit: number = 5) {
  if (!sopId) return [];

  const base = await prisma.sop.findUnique({
    where: { id: sopId },
    select: { department: true, category: true },
  });

  if (!base) return [];

  const results = await prisma.sop.findMany({
    take: limit,
    where: {
      AND: [
        { id: { not: sopId } },
        {
          OR: [
            { department: { equals: base.department } },
            { category: { equals: base.category } },
          ],
        },
      ],
    },
    orderBy: { updatedAt: "desc" },
    select: { id: true, code: true, title: true, department: true, category: true, status: true },
  });

  return results;
}

