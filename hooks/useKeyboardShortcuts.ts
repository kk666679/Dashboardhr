import { useEffect, useCallback, useRef } from "react";

interface ShortcutHandler {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
  handler: (e: KeyboardEvent) => void;
  preventDefault?: boolean;
}

export function useKeyboardShortcuts(handlers: ShortcutHandler[]) {
  const handlerMap = useRef<Map<string, ShortcutHandler>>(new Map());

  useEffect(() => {
    // Build map
    handlers.forEach((h) => {
      const key = buildKey(h);
      handlerMap.current.set(key, h);
    });
    return () => handlerMap.current.clear();
  }, [handlers]);

  const buildKey = (h: ShortcutHandler) => {
    let key = "";
    if (h.ctrl) key += "ctrl+";
    if (h.shift) key += "shift+";
    if (h.alt) key += "alt+";
    if (h.meta) key += "meta+";
    key += h.key.toLowerCase();
    return key;
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = buildKey({
        key: e.key,
        ctrl: e.ctrlKey || e.metaKey,
        shift: e.shiftKey,
        alt: e.altKey,
        meta: e.metaKey,
      } as any);
      const handler = handlerMap.current.get(key);
      if (handler) {
        if (handler.preventDefault !== false) {
          e.preventDefault();
        }
        handler.handler(e);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Helper to create handlers
  const createShortcut = useCallback((
    key: string,
    handler: (e: KeyboardEvent) => void,
    options?: { ctrl?: boolean; shift?: boolean; alt?: boolean; meta?: boolean; preventDefault?: boolean }
  ): ShortcutHandler => {
    return {
      key,
      handler,
      ctrl: options?.ctrl,
      shift: options?.shift,
      alt: options?.alt,
      meta: options?.meta,
      preventDefault: options?.preventDefault ?? true,
    };
  }, []);

  return { createShortcut };
}
