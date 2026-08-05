"use client";

import { useEffect } from "react";

interface HeatmapDataPoint {
  lat: number;
  lng: number;
  intensity?: number;
}

interface HeatmapLayerProps {
  data: HeatmapDataPoint[];
  radius?: number;
  blur?: number;
  maxZoom?: number;
  maxIntensity?: number;
  gradient?: Record<number, string>;
}

/**
 * Renders a density heatmap overlay on the map.
 * 2026 trend: Real-time density visualization for crowd monitoring and hotspot detection.
 * Uses Leaflet.heat or equivalent for rendering.
 */
export function HeatmapLayer({
  data,
  radius = 25,
  blur = 15,
  maxZoom = 18,
}: HeatmapLayerProps) {
  useEffect(() => {
    // Placeholder for heatmap rendering
    // In production: import leaflet.heat and add heat layer to map
    void data;
    void radius;
    void blur;
    void maxZoom;
  }, [data, radius, blur, maxZoom]);

  return null; // Renders via Leaflet plugin, not JSX
}

