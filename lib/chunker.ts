// lib/chunker.ts

/**
 * Configuration options for the chunking process.
 */
export interface ChunkerOptions {
  /**
   * Maximum size of each chunk in characters (or tokens if using token counting).
   * @default 1000
   */
  chunkSize?: number;

  /**
   * Number of overlapping characters/tokens between consecutive chunks.
   * Helps preserve context across chunk boundaries.
   * @default 200
   */
  overlap?: number;

  /**
   * Splitting strategy:
   * - 'recursive': recursively splits by separators (paragraphs, sentences, words)
   * - 'sentence': splits by sentences (using regex) and groups into chunks
   * - 'token': approximates tokens using a simple regex or a custom tokenizer
   * @default 'recursive'
   */
  strategy?: 'recursive' | 'sentence' | 'token';

  /**
   * Optional custom tokenizer function.
   * If provided, overrides the default token approximation.
   * Receives text and returns token array. Used only with strategy = 'token'.
   */
  tokenizer?: (text: string) => string[];

  /**
   * List of separators for recursive splitting, in priority order.
   * @default ['\n\n', '\n', '. ', ' ', '']
   */
  separators?: string[];

  /**
   * Minimum chunk size to keep. Chunks smaller than this after splitting
   * may be merged with the previous chunk.
   * @default 100
   */
  minChunkSize?: number;
}

/**
 * Represents a single chunk of text with optional metadata.
 */
export interface Chunk {
  /** The chunk content */
  text: string;
  /** Starting index in the original document (character offset) */
  startIndex: number;
  /** Ending index (exclusive) */
  endIndex: number;
  /** Sequence number (0‑based) */
  chunkIndex: number;
}

/**
 * Recursively splits text using a list of separators.
 * Mimics the behaviour of LangChain’s RecursiveCharacterTextSplitter.
 */
function recursiveSplit(
  text: string,
  separators: string[],
  chunkSize: number,
  overlap: number,
  minChunkSize: number
): Chunk[] {
  const chunks: Chunk[] = [];
  const separator = separators[0];
  const remainingSeparators = separators.slice(1);

  // Split by the current separator
  let splits: string[];
  if (separator === '') {
    splits = text.split('');
  } else {
    splits = text.split(new RegExp(`(${escapeRegex(separator)})`, 'g'));
    // Merge separators back as separate items? We'll treat them as part of the split.
    // Actually we want to keep the separators in the content. Simpler: use split and keep delimiters?
    // A robust implementation is complex. For simplicity, we use a standard split without keeping delimiters.
    // To improve: use a custom function that respects separators as boundaries.
    // We'll implement a proper recursive splitter that preserves structure.
  }

  // Re‑implement a cleaner recursive splitting algorithm:
  return recursiveSplitInternal(text, separators, chunkSize, overlap, minChunkSize, 0, text.length);
}

function recursiveSplitInternal(
  text: string,
  separators: string[],
  chunkSize: number,
  overlap: number,
  minChunkSize: number,
  startOffset: number,
  endOffset: number
): Chunk[] {
  if (text.length <= chunkSize) {
    return [{ text, startIndex: startOffset, endIndex: endOffset, chunkIndex: 0 }];
  }

  let separatorIndex = -1;
  let separatorUsed = '';
  let splitPos = -1;

  // Find the best separator to split at
  for (const sep of separators) {
    const pos = findSplitPosition(text, sep, chunkSize, overlap);
    if (pos !== -1) {
      separatorIndex = pos;
      separatorUsed = sep;
      splitPos = pos;
      break;
    }
  }

  if (splitPos === -1 || splitPos === 0) {
    // No suitable separator found – hard cut at chunkSize
    splitPos = Math.min(chunkSize, text.length);
  }

  const chunkText = text.slice(0, splitPos).trim();
  const remainingText = text.slice(splitPos).trim();

  const chunks: Chunk[] = [];
  if (chunkText.length >= minChunkSize) {
    chunks.push({
      text: chunkText,
      startIndex: startOffset,
      endIndex: startOffset + splitPos,
      chunkIndex: 0,
    });
  }

  // Compute overlap: we need to include tail of current chunk at start of next
  let overlapText = '';
  if (overlap > 0 && chunkText.length > overlap) {
    overlapText = chunkText.slice(-overlap);
  }

  const nextStartOffset = startOffset + splitPos;
  const nextText = overlapText + (overlapText ? ' ' : '') + remainingText;
  const nextChunks = recursiveSplitInternal(
    nextText,
    separators,
    chunkSize,
    overlap,
    minChunkSize,
    nextStartOffset - (overlapText ? overlapText.length : 0),
    endOffset
  );

  // Adjust chunk indices
  for (let i = 0; i < nextChunks.length; i++) {
    nextChunks[i].chunkIndex = chunks.length + i;
  }
  chunks.push(...nextChunks);
  return chunks;
}

/**
 * Finds the position to split at using a given separator, ensuring
 * the resulting chunk is as close to chunkSize as possible but not exceeding.
 */
function findSplitPosition(text: string, separator: string, chunkSize: number, overlap: number): number {
  let index = text.indexOf(separator);
  let best = -1;
  while (index !== -1) {
    if (index <= chunkSize) {
      best = index + separator.length;
    }
    if (index > chunkSize) break;
    index = text.indexOf(separator, index + 1);
  }
  return best;
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Sentence‑based splitter: splits by punctuation (.!?) and groups sentences into chunks.
 */
function sentenceSplit(text: string, chunkSize: number, overlap: number, minChunkSize: number): Chunk[] {
  const sentenceRegex = /[^.!?]+[.!?]+|.+$/g;
  const sentences: { text: string; start: number; end: number }[] = [];
  let match;
  while ((match = sentenceRegex.exec(text)) !== null) {
    sentences.push({
      text: match[0].trim(),
      start: match.index,
      end: match.index + match[0].length,
    });
  }

  const chunks: Chunk[] = [];
  let currentChunk: string[] = [];
  let currentStart = 0;
  let currentLength = 0;
  let chunkIndex = 0;

  for (let i = 0; i < sentences.length; i++) {
    const sent = sentences[i];
    if (currentLength + sent.text.length <= chunkSize) {
      if (currentChunk.length === 0) currentStart = sent.start;
      currentChunk.push(sent.text);
      currentLength += sent.text.length;
    } else {
      // Finalize current chunk
      if (currentChunk.length > 0) {
        chunks.push({
          text: currentChunk.join(' '),
          startIndex: currentStart,
          endIndex: sentences[i - 1].end,
          chunkIndex: chunkIndex++,
        });
      }
      // Start new chunk with overlap: include last `overlap` characters from previous chunk
      let overlapText = '';
      if (overlap > 0 && chunks.length > 0) {
        const prevText = chunks[chunks.length - 1].text;
        overlapText = prevText.slice(-overlap);
      }
      currentChunk = overlapText ? [overlapText, sent.text] : [sent.text];
      currentLength = overlapText.length + sent.text.length;
      currentStart = sent.start - (overlapText.length || 0);
    }
  }

  if (currentChunk.length > 0) {
    chunks.push({
      text: currentChunk.join(' '),
      startIndex: currentStart,
      endIndex: sentences[sentences.length - 1].end,
      chunkIndex: chunkIndex,
    });
  }

  // Filter out chunks smaller than minChunkSize (except if it's the only chunk)
  const filtered = chunks.filter((chunk, idx, arr) => {
    if (chunk.text.length >= minChunkSize) return true;
    if (arr.length === 1) return true;
    return false;
  });
  return filtered;
}

/**
 * Token‑based chunker. Uses a simple whitespace tokenizer unless a custom tokenizer is provided.
 */
function tokenSplit(
  text: string,
  chunkSize: number,
  overlap: number,
  minChunkSize: number,
  tokenizer?: (text: string) => string[]
): Chunk[] {
  const tokenize = tokenizer || ((t: string) => t.split(/\s+/).filter(Boolean));
  const tokens = tokenize(text);
  const chunks: Chunk[] = [];
  let startIdx = 0;
  let chunkIndex = 0;

  while (startIdx < tokens.length) {
    const endIdx = Math.min(startIdx + chunkSize, tokens.length);
    const chunkTokens = tokens.slice(startIdx, endIdx);
    const chunkText = chunkTokens.join(' ');
    // Find original character indices (approximate, using indexOf)
    let startPos = text.indexOf(chunkTokens[0]);
    let endPos = text.lastIndexOf(chunkTokens[chunkTokens.length - 1]) + chunkTokens[chunkTokens.length - 1].length;
    if (startPos === -1) startPos = 0;
    if (endPos === -1) endPos = text.length;

    chunks.push({
      text: chunkText,
      startIndex: startPos,
      endIndex: endPos,
      chunkIndex: chunkIndex++,
    });
    startIdx = endIdx - overlap;
    if (startIdx <= 0 && overlap > 0) startIdx = endIdx - Math.min(overlap, chunkSize / 2);
    if (startIdx <= startIdx - (endIdx - startIdx)) break; // prevent infinite loop
  }

  return chunks.filter((chunk) => chunk.text.length >= minChunkSize);
}

/**
 * Main chunking function. Splits a document into overlapping chunks.
 * @param text The input text to chunk.
 * @param options Configuration options.
 * @returns Array of chunks with metadata.
 */
export function chunkDocument(text: string, options: ChunkerOptions = {}): Chunk[] {
  const {
    chunkSize = 1000,
    overlap = 200,
    strategy = 'recursive',
    tokenizer,
    separators = ['\n\n', '\n', '. ', ' ', ''],
    minChunkSize = 100,
  } = options;

  if (text.length === 0) return [];

  if (overlap >= chunkSize) {
    throw new Error('Overlap must be less than chunkSize');
  }

  switch (strategy) {
    case 'recursive':
      return recursiveSplit(text, separators, chunkSize, overlap, minChunkSize);
    case 'sentence':
      return sentenceSplit(text, chunkSize, overlap, minChunkSize);
    case 'token':
      return tokenSplit(text, chunkSize, overlap, minChunkSize, tokenizer);
    default:
      throw new Error(`Unknown strategy: ${strategy}`);
  }
}

/**
 * Convenience function that returns only the text content of each chunk.
 */
export function chunkTexts(text: string, options?: ChunkerOptions): string[] {
  return chunkDocument(text, options).map((c) => c.text);
}