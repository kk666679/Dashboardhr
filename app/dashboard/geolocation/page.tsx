"use client";

import { useState, useRef } from "react";
import dynamic from "next/dynamic";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { FeatureCollection } from "geojson";
import { malaysiaWorksiteGeofences } from "@/lib/geolocation-utils";

// ----------------------------------------------------------------------
// FIXED MAP IMPORT
// ----------------------------------------------------------------------
const {
  MapContainer,
  TileLayer,
  GeoJSON,
  useMap,
} = require("react-leaflet");

// ----------------------------------------------------------------------
// GEOJSON LAYER (FIXED)
// ----------------------------------------------------------------------
function GeoJsonLayer({ data }: { data: FeatureCollection }) {
  const map = useMap();

  const style = (feature: any) => {
    const type = feature?.properties?.type;

    switch (type) {
      case "worksite":
        return { color: "#3b82f6", weight: 3, fillOpacity: 0.2 };
      case "restricted":
        return {
          color: "#ef4444",
          weight: 3,
          fillOpacity: 0.3,
          dashArray: "5,5",
        };
      case "accommodation":
        return { color: "#10b981", weight: 2, fillOpacity: 0.1 };
      default:
        return { color: "#6b7280", weight: 2, fillOpacity: 0.1 };
    }
  };

  const onEachFeature = (feature: any, layer: any) => {
    const props = feature.properties;

    if (!props) return;

    let popup = `<b>${props.name || "Unnamed"}</b>`;

    if (props.workerCount) popup += `<br>Workers: ${props.workerCount}`;
    if (props.status)
      popup += `<br>Status: <b>${props.status.toUpperCase()}</b>`;

    layer.bindPopup(popup);

    if (props.name) {
      layer.bindTooltip(props.name);
    }
  };

  return <GeoJSON data={data} style={style} onEachFeature={onEachFeature} />;
}

// ----------------------------------------------------------------------
// MAIN PAGE
// ----------------------------------------------------------------------
export default function GeolocationPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const mapRef = useRef<L.Map | null>(null);

  const geofences = (malaysiaWorksiteGeofences as FeatureCollection).features;

  const list = geofences.map((f: any) => ({
    id: f.properties?.name,
    name: f.properties?.name,
    type: f.properties?.type,
    workerCount: f.properties?.workerCount || 0,
    status: f.properties?.status || "inactive",
    feature: f,
  }));

  const focusZone = (feature: any) => {
    setSelected(feature.id);

    if (mapRef.current) {
      const layer = L.geoJSON(feature);
      mapRef.current.fitBounds(layer.getBounds(), {
        padding: [40, 40],
      });
    }
  };

  return (
    <div className="flex h-screen w-full bg-gray-100">
      {/* SIDEBAR */}
      <div
        className={`${
          sidebarOpen ? "w-80" : "w-0"
        } transition-all bg-white border-r overflow-hidden`}
      >
        {sidebarOpen && (
          <div className="p-4 space-y-4">
            <div className="flex justify-between">
              <h2 className="font-bold">Geofences</h2>
              <button onClick={() => setSidebarOpen(false)}>←</button>
            </div>

            <div className="text-sm bg-blue-50 p-2 rounded">
              Total: {list.length}
            </div>

            {list.map((z) => (
              <div
                key={z.id}
                onClick={() => focusZone(z.feature)}
                className={`p-3 border rounded cursor-pointer ${
                  selected === z.id ? "bg-blue-50 border-blue-400" : ""
                }`}
              >
                <div className="font-medium">{z.name}</div>
                <div className="text-xs text-gray-500">{z.type}</div>
                <div className="text-sm">👷 {z.workerCount}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MAP */}
      <div className="flex-1 relative">
        {!sidebarOpen && (
          <button
            className="absolute top-4 left-4 z-[999]"
            onClick={() => setSidebarOpen(true)}
          >
            →
          </button>
        )}

        <MapContainer
          center={[3.139, 101.687]}
          zoom={12}
          style={{ height: "100%", width: "100%" }}
          whenCreated={(map) => {
            mapRef.current = map;
          }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          <GeoJsonLayer data={malaysiaWorksiteGeofences} />
        </MapContainer>
      </div>
    </div>
  );
}