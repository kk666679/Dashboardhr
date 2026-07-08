import { prisma } from "@/lib/prisma";

type SopStructureLike = {
  documentInformation?: {
    title?: string;
    code?: string;
  };
  purpose?: string;
  scope?: string;
  processFlow?: Array<{ step?: string; description?: string }>;
};

function structureToMarkdown(structure: SopStructureLike) {
  const docInfo = structure?.documentInformation;
  return (
    `# ${docInfo?.title ?? "SOP"}\n\n` +
    `**Code:** ${docInfo?.code ?? ""}\n\n` +
    `## Purpose\n${structure?.purpose ?? ""}\n\n` +
    `## Scope\n${structure?.scope ?? ""}\n\n` +
    `## Process Flow\n` +
    (structure?.processFlow ?? [])
      .map((s) => `- **${s.step ?? ""}**: ${s.description ?? ""}`)
      .join("\n") +
    `\n`
  );
}

function escapeHtml(str: string) {
  // NOTE: escape quotes by omission for MVP export to avoid syntax issues.
  return str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "<")
    .replaceAll(">", ">")
    .replaceAll("'", "&#039;");
}

function structureToHtml(structure: SopStructureLike) {
  const markdown = structureToMarkdown(structure);
  return `<!doctype html><html><head><meta charset="utf-8"/><title>SOP</title></head><body><pre>${escapeHtml(markdown)}</pre></body></html>`;
}

// Synchronous content-based exports used by the sop router
export function exportSopToMarkdown(structure: SopStructureLike): string;
export function exportSopToMarkdown(sopId: string, version: number): Promise<string>;
export function exportSopToMarkdown(sopIdOrStructure: string | SopStructureLike, version?: number): string | Promise<string> {
  if (typeof sopIdOrStructure === "object") return structureToMarkdown(sopIdOrStructure);
  return _exportSopToMarkdown(sopIdOrStructure, version!);
}

async function _exportSopToMarkdown(sopId: string, version: number) {
  const v = await prisma.sopVersion.findFirst({
    where: { sopId, version },
    select: { content: true },
  });

  if (!v) throw new Error("SopVersion not found");

  const content = v.content as any;
  const structure = content?.structure ?? content;
  return structureToMarkdown(structure);
}

export function exportSopToHtml(structure: SopStructureLike): string;
export function exportSopToHtml(sopId: string, version: number): Promise<string>;
export function exportSopToHtml(sopIdOrStructure: string | SopStructureLike, version?: number): string | Promise<string> {
  if (typeof sopIdOrStructure === "object") return structureToHtml(sopIdOrStructure);
  return _exportSopToHtml(sopIdOrStructure, version!);
}

async function _exportSopToHtml(sopId: string, version: number) {
  const v = await prisma.sopVersion.findFirst({
    where: { sopId, version },
    select: { content: true },
  });

  if (!v) throw new Error("SopVersion not found");

  const content = v.content as any;
  const structure = content?.structure ?? content;
  return structureToHtml(structure);
}

