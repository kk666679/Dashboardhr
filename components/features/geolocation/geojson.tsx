"use client";

import { GeoJSON } from "react-leaflet";
import type { FeatureCollection, GeoJsonObject } from "geojson";
import { addGeoJsonToMap } from "@/lib/geolocation-utils";
import { useEffect, useRef } from "react";
import L from "leaflet";
import { malaysiaWorksiteGeofences } from "@/lib/geolocation-utils";

// Local interface for HR GeoJSON properties
interface HrGeoJsonProperties {
  name?: string;
  type?: string;
  status?: string;
  workerCount?: number;
  popupContent?: string;
}

// Props interface
interface GeoJsonLayerProps {
  data: FeatureCollection | GeoJsonObject;
  styleFn?: (feature?: GeoJSON.Feature<GeoJSON.Geometry>) => L.PathOptions;
  onEachFeature?: (feature: GeoJSON.Feature<GeoJSON.Geometry>, layer: L.Layer) => void;
  className?: string;
  popupOptions?: L.PopupOptions;
}

export function GeoJsonLayer({
  data,
  styleFn,
  onEachFeature,
  className = "",
  popupOptions,
}: GeoJsonLayerProps) {
  const geoJsonRef = useRef<L.GeoJSON>(null);

  // Default style function for HR geofences
const defaultStyle = (feature?: GeoJSON.Feature<GeoJSON.Geometry>): L.PathOptions => {
    const type = feature?.properties?.type;
    switch (type) {
      case "worksite":
        return { color: "#3b82f6", weight: 3, fillOpacity: 0.2 };
      case "restricted":
        return { color: "#ef4444", weight: 4, fillOpacity: 0.3, dashArray: "5,5" };
      case "accommodation":
        return { color: "#10b981", weight: 2, fillOpacity: 0.1 };
      default:
        return { color: "#6b7280", weight: 2, fillOpacity: 0.1 };
    }
  };

  // Default onEachFeature with HR properties
const defaultOnEachFeature = (feature: GeoJSON.Feature<GeoJSON.Geometry>, layer: L.Layer) => {
    const props = feature.properties as HrGeoJsonProperties | undefined;
    if (!props) return;

    // Popup with worker count, status
    let popupContent = `<b>${props.name || "Unnamed"}</b>`;
    if (props.workerCount) popupContent += `<br>Workers: ${props.workerCount}`;
    if (props.status) popupContent += `<br>Status: <span style="color: ${props.status === 'active' ? '#10b981' : '#ef4444'}">${props.status.toUpperCase()}</span>`;
    if (props.popupContent) popupContent += `<br>${props.popupContent}`;
    layer.bindPopup(popupContent, popupOptions);

    // Tooltip
    if (props.name) {
      layer.bindTooltip(props.name, { permanent: false, direction: "top" });
    }
  };

// useEffect(() => {
//   if (geoJsonRef.current && geoJsonRef.current.getLayers().length > 0) {
//     // Optional: Fit bounds to new data
//     const map = geoJsonRef.current._map;
//     if (map) {
//       map.fitBounds(geoJsonRef.current.getBounds());
//     }
//   }
// }, [data]);

  return (
    <GeoJSON
      ref={geoJsonRef}
      data={data}
      style={styleFn || defaultStyle}
      onEachFeature={onEachFeature || defaultOnEachFeature}
    />
  );
}

// Demo component with sample data
export function GeoJsonDemo() {
  return (
    <GeoJsonLayer
      data={malaysiaWorksiteGeofences}
      className="z-[400]"
    />
  );
}

