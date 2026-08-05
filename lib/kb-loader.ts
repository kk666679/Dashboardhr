import fs from 'fs/promises';
import path from 'path';
import { upsertKbDocument } from './kb';
import type { KbDocument } from './kb/types';

/**
 * Walk a directory recursively and return all file paths matching the filter.
 */
async function walkDir(dir: string, filter: (f: string) => boolean): Promise<string[]> {
  const results: string[] = [];
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        results.push(...await walkDir(full, filter));
      } else if (filter(entry.name)) {
        results.push(full);
      }
    }
  } catch {
    // directory doesn't exist — skip silently
  }
  return results;
}

/**
 * Loads and indexes all Malaysian regulatory knowledge documents from
 * .openclaw/knowledge/ into the pgvector KB. Markdown files are chunked
 * by heading (## section) to keep each chunk under ~1 000 tokens.
 */
export async function loadOpenClawKnowledge(): Promise<number> {
  const knowledgeRoot = path.join(process.cwd(), '.openclaw', 'knowledge');
  const mdFiles = await walkDir(knowledgeRoot, (f) => f.endsWith('.md'));

  console.log(`[KB-Loader] Found ${mdFiles.length} OpenClaw knowledge docs`);
  let indexed = 0;

  for (const filePath of mdFiles) {
    try {
      const raw = await fs.readFile(filePath, 'utf-8');
      const relPath = path.relative(process.cwd(), filePath).replace(/\\/g, '/');
      const domain = relPath.split('/')[2] ?? 'general'; // .openclaw/knowledge/<domain>/file.md

      // Split by H2 headings for meaningful chunks
      const chunks = raw.split(/\n(?=## )/).filter(c => c.trim().length > 50);

      for (let i = 0; i < chunks.length; i++) {
        const chunkText = chunks[i].trim().slice(0, 4000); // cap chunk size
        const heading = chunkText.match(/^#+ (.+)/m)?.[1] ?? path.basename(filePath, '.md');
        const chunkId = `openclaw:${domain}:${path.basename(filePath, '.md')}:${i}`;

        const doc: Omit<KbDocument, 'embedding'> = {
          id: chunkId,
          content: chunkText,
          metadata: {
            source: relPath,
            standard: domain,
            clause: String(i),
            title: heading,
            tenantId: undefined,
            createdAt: new Date(),
          },
        };

        await upsertKbDocument(doc);
        indexed++;
      }
    } catch (err) {
      console.warn(`[KB-Loader] Skipping ${filePath}:`, err);
    }
  }

  console.log(`[KB-Loader] OpenClaw knowledge: ${indexed} chunks indexed from ${mdFiles.length} files`);
  return indexed;
}

/**
 * Load and index all knowledge-base/*.json files.
 * Run on app startup or via /api/kb/ingest?preload=true.
 */
export async function loadKnowledgeBase(): Promise<void> {
  const kbDir = path.join(process.cwd(), 'knowledge-base');
  try {
    const files = await fs.readdir(kbDir);
    const jsonFiles = files.filter(f => f.endsWith('.json') && f.includes('-clauses'));

    console.log(`[KB-Loader] Found ${jsonFiles.length} ISO JSON files`);

    for (const file of jsonFiles) {
      const filePath = path.join(kbDir, file);
      const content = await fs.readFile(filePath, 'utf-8');
      const data = JSON.parse(content);

      // Extract clauses array (iso9001_clauses, etc.)
      const standard = file.replace('-clauses.json', '').toUpperCase();
      const clausesKey = `${standard.toLowerCase()}_clauses` as keyof typeof data;
      const clauses = data[clausesKey] ?? data.iso9001_clauses ?? [];

      for (const clause of clauses) {
        const chunkId = `${standard}-${clause.clause}`;
        const chunkContent = `
Clause ${clause.clause}: ${clause.title}
Summary: ${clause.summary}
Requirements: ${Array.isArray(clause.requirements) ? clause.requirements.join('\\n- ') : clause.requirements}
        `.trim();

        const doc: Omit<KbDocument, 'embedding'> = {
          id: chunkId,
          content: chunkContent,
          metadata: {
            source: file,
            standard,
            clause: clause.clause as string,
            title: clause.title as string,
            tenantId: undefined, // global KB
            createdAt: new Date(),
          },
        };

        await upsertKbDocument(doc);
        console.log(`[KB-Loader] Indexed: ${chunkId} (${standard})`);
      }
    }

    const stats = require('./kb').kbStats();
    console.log(`[KB-Loader] Complete: ${stats.totalDocs} docs loaded`);

    // Also load OpenClaw Malaysian regulatory knowledge
    await loadOpenClawKnowledge();
  } catch (err) {
    console.error('[KB-Loader] Failed:', err);
  }
}

export async function ingestKnowledgeBase(file: File): Promise<KbDocument[]> {
  try {
    const text = await file.text();
    const chunkId = `ingest-${Date.now()}-${file.name.replace(/[^a-z0-9]/gi, '_')}`;
    const doc: Omit<KbDocument, 'embedding'> = {
      id: chunkId,
      content: text.slice(0, 10000), // truncate if too long
      metadata: {
        source: file.name,
        standard: 'upload',
        clause: 'user-upload',
        title: `Uploaded: ${file.name}`,
        tenantId: undefined,
        createdAt: new Date(),
      },
    };
    await upsertKbDocument(doc);
    console.log(`[KB-Ingest] Added: ${chunkId}`);
    return [doc as KbDocument];
  } catch (err) {
    console.error('[KB-Ingest] Error:', err);
    throw err;
  }
}



// CLI/run on demand
if (import.meta.url === `file://${process.argv[1]}`) {
  loadKnowledgeBase().catch(console.error);
}

export default loadKnowledgeBase;

