// Re‑export the unified embedding function from @/lib/embeddings
// This guarantees 384‑dim vectors (from @xenova/transformers) for all embedding operations.
export { embed } from "@/lib/embeddings";
