"use client";

import { MapContainer, TileLayer, useMapEvents, ScaleControl } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";

// Fix default Leaflet icons for Next.js SSR
delete (L.Icon.Default.prototype as any)._getIconUrl;
import type { RefObject } from 'react';
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// Props interface
interface LeafletMapProps {
  center?: [number, number];
  zoom?: number;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  controls?: {
    zoom?: boolean;
    scale?: boolean;
    attribution?: boolean;
  };
  onLoad?: (map: L.Map) => void;
  onClick?: (e: L.LeafletMouseEvent) => void;
}

export function LeafletMap({
  center = [3.139, 101.687], // Kuala Lumpur default
  zoom = 13,
  children,
  className = "",
  style = { height: "400px", width: "100%" },
  controls = { zoom: true, scale: true, attribution: true },
  onLoad,
  onClick,
}: LeafletMapProps) {
  useEffect(() => {
    // Leaflet cleanup
    return () => {
      if (typeof window !== "undefined" && (window as any).mapInstance) {
        (window as any).mapInstance.remove();
        delete (window as any).mapInstance;
      }
    };
  }, []);

  function MapEvents() {
    const map = useMapEvents({
      load: () => {
        if (typeof window !== "undefined") {
          (window as any).mapInstance = map;
        }
        onLoad?.(map);
      },
      click: onClick || undefined,
    });
    return null;
  }

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={style}
      className={className}
      zoomControl={controls.zoom}
      attributionControl={controls.attribution}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {controls.scale && <ScaleControl />}
      <MapEvents />
      {children}
    </MapContainer>
  );
}

// Usage example:
/*
<LeafletMap center={[3.139, 101.687]} zoom={13}>
  <GeoJsonLayer data={geofences} />
  <Marker position={[3.14, 101.69]}>
    <Popup>Worker Location</Popup>
  </Marker>
</LeafletMap>
*/

