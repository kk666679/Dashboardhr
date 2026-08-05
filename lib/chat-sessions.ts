/**
 * lib/chat-sessions.ts
 *
 * In-process session store for AI chat history.
 * Survives hot-reloads in dev via globalThis singleton.
 * Replace with Redis/DB in production for multi-instance deployments.
 */

type Message = { role: "user" | "assistant" | "system"; content: string };

const g = globalThis as typeof globalThis & {
  __chatSessions?: Map<string, Message[]>;
};

const sessions: Map<string, Message[]> = (g.__chatSessions ??= new Map());

const MAX_SESSIONS = 100;

// Evict oldest session if over limit (simple LRU approximation)
function evictIfNeeded() {
  if (sessions.size > MAX_SESSIONS) {
    const firstKey = sessions.keys().next().value;
    if (firstKey) {
      sessions.delete(firstKey);
    }
  }
}

export function getChatSession(sessionId: string): Message[] {
  return sessions.get(sessionId) ?? [];
}

export function setChatSession(sessionId: string, messages: Message[]): void {
  evictIfNeeded();
  sessions.set(sessionId, messages);
}

export function deleteChatSession(sessionId: string): void {
  sessions.delete(sessionId);
}
