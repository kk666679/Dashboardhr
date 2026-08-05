"use client";

import { MarkerType } from "@xyflow/react";

export const edgeMarkers = {
  arrow: {
    type: MarkerType.ArrowClosed,
    width: 20,
    height: 20,
    color: "#64748b",
  },
  arrowFilled: {
    type: MarkerType.ArrowClosed,
    width: 20,
    height: 20,
    color: "#3b82f6",
  },
  arrowOpen: {
    type: MarkerType.Arrow,
    width: 20,
    height: 20,
    color: "#64748b",
  },
  circle: {
    type: MarkerType.ArrowClosed,
    width: 16,
    height: 16,
    color: "#64748b",
  },
  diamond: {
    type: MarkerType.ArrowClosed,
    width: 16,
    height: 16,
    color: "#64748b",
  },
};

export const getMarker = (type: keyof typeof edgeMarkers, color?: string) => ({
  ...edgeMarkers[type],
  color: color || edgeMarkers[type].color,
});