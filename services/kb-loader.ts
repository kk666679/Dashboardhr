import fs from 'fs/promises';
import path from 'path';
import { upsertKbDocument } from '@/lib/kb';

export async function loadAndIndexKnowledgeBase(): Promise<void> {
  const kbDir = path.join(process.cwd(), 'knowledge-base');

  let files: string[];
  try {
    files = await fs.readdir(kbDir);
  } catch {
    console.warn('[kb-loader] knowledge-base directory not found, skipping.');
    return;
  }

  const jsonFiles = files.filter((f) => f.endsWith('.json'));

  for (const file of jsonFiles) {
    const filePath = path.join(kbDir, file);
    const content = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(content);

    const standard = file
      .replace('-clauses.json', '')
      .replace('.json', '')
      .toUpperCase();

    const clausesKey = `${standard.toLowerCase()}_clauses`;
    const clauses: any[] =
      data[clausesKey] ?? data.iso9001_clauses ?? (Array.isArray(data) ? data : []);

    for (const clause of clauses) {
      const chunkId = `${standard}-${clause.clause}`;
      const chunkContent = [
        `Clause: ${clause.clause}`,
        `Title: ${clause.title}`,
        `Summary: ${clause.summary ?? ''}`,
        `Requirements: ${Array.isArray(clause.requirements) ? clause.requirements.join('\n') : ''}`,
      ]
        .filter(Boolean)
        .join('\n');

      await upsertKbDocument({
        id: chunkId,
        content: chunkContent,
        metadata: {
          source: file,
          standard,
          clause: String(clause.clause),
          title: String(clause.title ?? ''),
          createdAt: new Date(),
        },
      });
    }
  }

  console.log('[kb-loader] Knowledge base indexing complete.');
}
