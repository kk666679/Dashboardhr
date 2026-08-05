"use client";

import { useEffect, useRef, MutableRefObject } from "react";
import type { FeatureCollection, Feature, Geometry, GeoJsonProperties } from "geojson";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import type { StyleFunction } from "leaflet";

/* ── Fix default marker icons (broken by turbopack) ── */
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

/* ── Zone style map ── */
const zoneStyles: Record<string, L.PathOptions> = {
  worksite:      { color: "#5c6ff5", weight: 2.5, fillOpacity: 0.18 },
  restricted:    { color: "#e5534b", weight: 2.5, fillOpacity: 0.22, dashArray: "6 4" },
  accommodation: { color: "#22c55e", weight: 2,   fillOpacity: 0.12 },
};
const defaultStyle: L.PathOptions = { color: "#888", weight: 2, fillOpacity: 0.1 };

/* ── GeoJSON layer inside the map context ── */
function GeoJsonLayer({
  data,
  selectedId,
  onFocusZoneRef,
}: {
  data: FeatureCollection;
  selectedId: string | null;
  onFocusZoneRef: MutableRefObject<((id: string) => void) | null>;
}) {
  const map = useMap();
  const layerMapRef = useRef<Record<string, L.GeoJSON>>({});

  /* Register a focus callback so parent can call it */
  useEffect(() => {
    onFocusZoneRef.current = (id: string) => {
      const geoLayer = layerMapRef.current[id];
      if (geoLayer) {
        map.fitBounds(geoLayer.getBounds(), { padding: [48, 48], maxZoom: 16 });
      }
    };
  }, [map, onFocusZoneRef]);

  /* Highlight selected zone */
  useEffect(() => {
    Object.entries(layerMapRef.current).forEach(([id, layer]) => {
      const feature = data.features.find((f: any) => f.properties?.name === id);
      const type = (feature as any)?.properties?.type ?? "worksite";
      const base = zoneStyles[type] ?? defaultStyle;
      layer.setStyle(
        id === selectedId
          ? { ...base, weight: 3.5, fillOpacity: (base.fillOpacity ?? 0.15) + 0.15 }
          : base,
      );
    });
  }, [selectedId, data.features]);

  const style: StyleFunction = (feature?: Feature<Geometry, GeoJsonProperties>) => {
    const type = (feature?.properties as any)?.type ?? "worksite";
    return zoneStyles[type] ?? defaultStyle;
  };

  const onEachFeature = (feature: Feature<Geometry, GeoJsonProperties>, layer: L.Layer) => {
    const props = feature.properties as any;
    if (!props) return;

    // Store layer reference by name
    const name: string = props.name ?? "";
    if (name) {
      const geoLayer = L.geoJSON(feature);
      layerMapRef.current[name] = geoLayer;
    }

    // Popup
    let popup = `<strong style="font-size:13px">${props.name ?? "Zone"}</strong>`;
    if (props.type)        popup += `<br/><span style="color:#888;font-size:11px">${props.type}</span>`;
    if (props.workerCount) popup += `<br/>Workers: <strong>${props.workerCount}</strong>`;
    if (props.status)      popup += `<br/>Status: <strong>${props.status}</strong>`;
    layer.bindPopup(popup);

    if (props.name) {
      (layer as L.Path).bindTooltip(props.name, { permanent: false, direction: "top" });
    }
  };

  return (
    <GeoJSON
      data={data}
      style={style}
      onEachFeature={onEachFeature}
    />
  );
}

/* ── Map container ── */
interface MapViewProps {
  geofences: FeatureCollection;
  selectedId: string | null;
  onFocusZoneRef: MutableRefObject<((id: string) => void) | null>;
}

export default function MapView({ geofences, selectedId, onFocusZoneRef }: MapViewProps) {
  return (
    <MapContainer
      center={[3.139, 101.687]}
      zoom={12}
      style={{ height: "100%", width: "100%" }}
      zoomControl={true}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      <GeoJsonLayer
        data={geofences}
        selectedId={selectedId}
        onFocusZoneRef={onFocusZoneRef}
      />
    </MapContainer>
  );
}
