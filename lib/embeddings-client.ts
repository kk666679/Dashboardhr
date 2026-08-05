"use client";

// Stub — @tensorflow-models/universal-sentence-encoder is not installed
export async function embedClient(_text: string): Promise<number[]> { return []; }
export async function embedClientBatch(_texts: string[]): Promise<number[][]> { return []; }

export function cosineSimilarityClient(a: number[], b: number[]): number {
  let dot = 0, magA = 0, magB = 0;
  for (let i = 0; i < a.length; i++) { dot += a[i] * b[i]; magA += a[i] ** 2; magB += b[i] ** 2; }
  return magA === 0 || magB === 0 ? 0 : dot / (Math.sqrt(magA) * Math.sqrt(magB));
}

export function normalize(vec: number[]): number[] {
  const mag = Math.sqrt(vec.reduce((s, v) => s + v * v, 0));
  return mag === 0 ? vec : vec.map((v) => v / mag);
}
