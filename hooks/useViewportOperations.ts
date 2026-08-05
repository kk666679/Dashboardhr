import { useCallback } from "react";
import { useReactFlow } from "@xyflow/react";

interface UseViewportOperationsOptions {
  snapToGrid?: boolean;
  gridSize?: number;
}

export function useViewportOperations(options: UseViewportOperationsOptions = {}) {
  const { snapToGrid = true, gridSize = 15 } = options;
  const { fitView, zoomIn, zoomOut, setViewport, getViewport, zoomTo } = useReactFlow();

  const fit = useCallback(
    (padding = 0.2, duration = 200) => {
      fitView({ padding, duration });
    },
    [fitView]
  );

  const zoomInBy = useCallback(
    (amount = 0.2, duration = 200) => {
      const vp = getViewport();
      const newZoom = vp.zoom * (1 + amount);
      setViewport({ x: vp.x, y: vp.y, zoom: newZoom }, { duration });
    },
    [getViewport, setViewport]
  );

  const zoomOutBy = useCallback(
    (amount = 0.2, duration = 200) => {
      const vp = getViewport();
      const newZoom = vp.zoom / (1 + amount);
      setViewport({ x: vp.x, y: vp.y, zoom: newZoom }, { duration });
    },
    [getViewport, setViewport]
  );

  const zoomToLevel = useCallback(
    (level: number, duration = 200) => {
      zoomTo(level, { duration });
    },
    [zoomTo]
  );

  const centerView = useCallback(
    (x: number, y: number, zoom?: number) => {
      setViewport({ x, y, zoom: zoom || getViewport().zoom }, { duration: 200 });
    },
    [setViewport, getViewport]
  );

  const snapPosition = useCallback(
    (pos: { x: number; y: number }) => {
      if (!snapToGrid) return pos;
      return {
        x: Math.round(pos.x / gridSize) * gridSize,
        y: Math.round(pos.y / gridSize) * gridSize,
      };
    },
    [snapToGrid, gridSize]
  );

  return {
    fit,
    fitToView: fit,
    zoomIn: zoomInBy,
    zoomOut: zoomOutBy,
    zoomTo: zoomToLevel,
    centerView,
    snapPosition,
    getViewport,
  };
}
