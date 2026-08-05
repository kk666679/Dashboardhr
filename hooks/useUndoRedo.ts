"use client";

// hooks/useUndoRedo.ts
import { useState, useCallback, useRef } from "react";

interface UseUndoRedoOptions<T> {
  maxHistory?: number;
  onStateChange?: (state: T) => void;
}

export function useUndoRedo<T>(options: UseUndoRedoOptions<T> = {}) {
  const { maxHistory = 50, onStateChange } = options;
  
  const [history, setHistory] = useState<T[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const isUndoRedoAction = useRef(false);

  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;

  const pushHistory = useCallback(
    (state: T) => {
      // Don't push if we're in the middle of undo/redo
      if (isUndoRedoAction.current) {
        isUndoRedoAction.current = false;
        return;
      }

      setHistory((prev) => {
        // If we're not at the end, truncate future states
        const newHistory = prev.slice(0, currentIndex + 1);
        
        // Add new state
        newHistory.push(state);
        
        // Limit history size
        if (newHistory.length > maxHistory) {
          newHistory.shift();
          // Adjust currentIndex if we shifted
          setCurrentIndex((idx) => Math.max(0, idx - 1));
          return newHistory;
        }
        
        setCurrentIndex(newHistory.length - 1);
        return newHistory;
      });
    },
    [currentIndex, maxHistory]
  );

  const undo = useCallback(() => {
    if (!canUndo) return;
    
    isUndoRedoAction.current = true;
    const newIndex = currentIndex - 1;
    setCurrentIndex(newIndex);
    
    const state = history[newIndex];
    onStateChange?.(state);
    return state;
  }, [canUndo, currentIndex, history, onStateChange]);

  const redo = useCallback(() => {
    if (!canRedo) return;
    
    isUndoRedoAction.current = true;
    const newIndex = currentIndex + 1;
    setCurrentIndex(newIndex);
    
    const state = history[newIndex];
    onStateChange?.(state);
    return state;
  }, [canRedo, currentIndex, history, onStateChange]);

  const resetHistory = useCallback(() => {
    setHistory([]);
    setCurrentIndex(-1);
    isUndoRedoAction.current = false;
  }, []);

  const getCurrentState = useCallback(() => {
    if (currentIndex === -1 || currentIndex >= history.length) {
      return null;
    }
    return history[currentIndex];
  }, [currentIndex, history]);

  return {
    history,
    currentIndex,
    pushHistory,
    undo,
    redo,
    canUndo,
    canRedo,
    resetHistory,
    getCurrentState,
  };
}