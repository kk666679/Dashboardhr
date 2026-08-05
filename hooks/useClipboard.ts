"use client";

// hooks/useClipboard.ts
import { useState, useCallback } from "react";

interface ClipboardData {
  nodes: any[];
  edges: any[];
  [key: string]: any;
}

export function useClipboard() {
  const [clipboard, setClipboard] = useState<ClipboardData | null>(null);

  const copy = useCallback((data: ClipboardData) => {
    try {
      // Store in memory
      setClipboard(data);
      
      // Also try to store in native clipboard as JSON
      try {
        const jsonString = JSON.stringify(data);
        if (navigator?.clipboard?.writeText) {
          navigator.clipboard.writeText(jsonString).catch(() => {
            // Silent fail - we already have it in memory
          });
        }
      } catch {
        // Silent fail for native clipboard
      }
      
      return true;
    } catch (error) {
      console.error("Failed to copy:", error);
      return false;
    }
  }, []);

  const paste = useCallback(() => {
    if (clipboard) {
      return clipboard;
    }
    
    // Try to restore from native clipboard
    try {
      if (navigator?.clipboard?.readText) {
        navigator.clipboard.readText().then((text) => {
          try {
            const data = JSON.parse(text);
            if (data.nodes && data.edges) {
              setClipboard(data);
              return data;
            }
          } catch {
            // Not valid JSON or not our format
          }
        }).catch(() => {
          // Silent fail
        });
      }
    } catch {
      // Silent fail
    }
    
    return null;
  }, [clipboard]);

  const cut = useCallback((data: ClipboardData) => {
    copy(data);
    return data;
  }, [copy]);

  const clearClipboard = useCallback(() => {
    setClipboard(null);
    try {
      if (navigator?.clipboard?.writeText) {
        navigator.clipboard.writeText("").catch(() => {
          // Silent fail
        });
      }
    } catch {
      // Silent fail
    }
  }, []);

  const hasClipboard = useCallback(() => {
    return clipboard !== null;
  }, [clipboard]);

  return {
    clipboard,
    copy,
    paste,
    cut,
    clearClipboard,
    hasClipboard,
  };
}