/**
 * lib/embeddings.ts
 *
 * Singleton wrapper around @xenova/transformers.
 * Uses Xenova/all-MiniLM-L6-v2 (384-dim, ~23 MB, runs fully in-process via ONNX).
 *
 * SERVER-ONLY — never import from client components.
 */

import type { pipeline as PipelineType } from "@xenova/transformers";

// Keep models in the project cache, not the OS temp dir
// The actual transformer runtime is loaded lazily to avoid build-time
// import issues when native dependencies like sharp are unavailable.

type EmbeddingPipeline = any;

let _pipe: EmbeddingPipeline | null = null;

async function getPipeline(): Promise<EmbeddingPipeline> {
  if (!_pipe) {
    const transformers = await import("@xenova/transformers");
    transformers.env.cacheDir = "./.cache/xenova";
    _pipe = await transformers.pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2", {
      quantized: true, // use int8 quantized model (~6 MB vs 23 MB)
    });
  }
  return _pipe;
}

/**
 * Embed a single string → Float32Array (384 dimensions).
 * Mean-pools the last hidden state so the result is sentence-level.
 */
export async function embed(text: string): Promise<number[]> {
  const pipe = await getPipeline();
  const output = await pipe(text, { pooling: "mean", normalize: true });
  return Array.from(output.data as Float32Array);
}

/**
 * Embed multiple strings in one batch.
 */
export async function embedBatch(texts: string[]): Promise<number[][]> {
  return Promise.all(texts.map(embed));
}

/**
 * Cosine similarity between two embedding vectors (−1 … 1).
 */
export async function cosineSimilarity(a: number[], b: number[]) {
  const { cos_sim } = await import("@xenova/transformers");
  return cos_sim(a, b);
}

/**
 * Rank a list of candidates by semantic similarity to a query.
 * Returns candidates sorted descending by score, with scores attached.
 */
export async function semanticRank<T extends { text: string }>(
  query: string,
  candidates: T[],
  topK = 5,
): Promise<Array<T & { score: number }>> {
  if (!candidates.length) return [];

  const [queryVec, ...candidateVecs] = await embedBatch([
    query,
    ...candidates.map((c) => c.text),
  ]);

  const ranked = await Promise.all(
    candidates.map(async (c, i) => ({
      ...c,
      score: await cosineSimilarity(queryVec, candidateVecs[i]),
    })),
  );

  return ranked.sort((a, b) => b.score - a.score).slice(0, topK);
}
