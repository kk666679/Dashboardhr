import { useState, useCallback, useRef } from "react";

interface CanvasSettings {
  gridSize: number;
  snapEnabled: boolean;
  gridEnabled: boolean;
  zoomMin: number;
  zoomMax: number;
}

export function useCanvas(initialSettings?: Partial<CanvasSettings>) {
  const [settings, setSettings] = useState<CanvasSettings>({
    gridSize: 15,
    snapEnabled: true,
    gridEnabled: true,
    zoomMin: 0.2,
    zoomMax: 2,
    ...initialSettings,
  });

  const [viewport, setViewport] = useState({ x: 0, y: 0, zoom: 1 });
  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);
  const [selectedEdges, setSelectedEdges] = useState<string[]>([]);

  const updateSettings = useCallback((newSettings: Partial<CanvasSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  }, []);

  const setGridSize = useCallback((size: number) => {
    setSettings((prev) => ({ ...prev, gridSize: size }));
  }, []);

  const toggleSnap = useCallback(() => {
    setSettings((prev) => ({ ...prev, snapEnabled: !prev.snapEnabled }));
  }, []);

  const toggleGrid = useCallback(() => {
    setSettings((prev) => ({ ...prev, gridEnabled: !prev.gridEnabled }));
  }, []);

  const setZoomLimits = useCallback((min: number, max: number) => {
    setSettings((prev) => ({ ...prev, zoomMin: min, zoomMax: max }));
  }, []);

  const selectNode = useCallback((id: string) => {
    setSelectedNodes((prev) => {
      if (prev.includes(id)) return prev.filter((n) => n !== id);
      return [...prev, id];
    });
  }, []);

  const selectEdge = useCallback((id: string) => {
    setSelectedEdges((prev) => {
      if (prev.includes(id)) return prev.filter((e) => e !== id);
      return [...prev, id];
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedNodes([]);
    setSelectedEdges([]);
  }, []);

  const selectAll = useCallback((nodeIds: string[], edgeIds: string[]) => {
    setSelectedNodes(nodeIds);
    setSelectedEdges(edgeIds);
  }, []);

  return {
    settings,
    viewport,
    setViewport,
    selectedNodes,
    selectedEdges,
    setSelectedNodes,
    setSelectedEdges,
    updateSettings,
    setGridSize,
    toggleSnap,
    toggleGrid,
    setZoomLimits,
    selectNode,
    selectEdge,
    clearSelection,
    selectAll,
  };
}
