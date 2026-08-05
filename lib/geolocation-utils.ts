import * as L from 'leaflet';
<<<<<<< HEAD
import type { GeoJsonObject, Feature, Geometry, GeoJsonProperties } from 'geojson';
import type { HrGeoJsonProperties } from '@/types/geolocation';

export function addGeoJsonToMap(
  geoJsonData: GeoJsonObject, 
  map: L.Map
): L.GeoJSON {
  const geoJsonLayer = L.geoJSON(geoJsonData, {
    onEachFeature: (feature: Feature<Geometry, GeoJsonProperties>, layer: L.Layer) => {
      const props = feature.properties;
=======
import type { GeoJsonObject, Feature, Geometry } from 'geojson';

// HR-specific GeoJSON properties — standalone interface (not extending nullable GeoJsonProperties)
interface HrGeoJsonProperties {
  name?: string;
  popupContent?: string;
  type?: string;
  status?: string;
  workerCount?: number;
  [key: string]: unknown;
}

export function addGeoJsonToMap(
  geoJsonData: GeoJsonObject,
  map: L.Map
): L.GeoJSON {
  const geoJsonLayer = L.geoJSON(geoJsonData, {
    onEachFeature: (feature: Feature<Geometry, HrGeoJsonProperties | null | undefined>, layer: L.Layer) => {
      const props = feature.properties as HrGeoJsonProperties | null | undefined;
>>>>>>> 237f310 (Add libraries, services and application logic)
      if (!props) return;
      if (props.popupContent) {
        layer.bindPopup(props.popupContent);
      }
<<<<<<< HEAD
      if ((props as HrGeoJsonProperties).name) {
        layer.bindTooltip((props as HrGeoJsonProperties).name, { permanent: false, direction: 'top' });
=======
      if (props.name) {
        layer.bindTooltip(props.name, { permanent: false, direction: 'top' });
>>>>>>> 237f310 (Add libraries, services and application logic)
      }
    },
    style: (feature?: { properties?: { type?: string } }) => {
      const type = feature?.properties?.type;
      switch (type) {
        case 'worksite':
          return { color: '#3b82f6', weight: 3, fillOpacity: 0.2 };
        case 'restricted':
          return { color: '#ef4444', weight: 4, fillOpacity: 0.3, dashArray: '5,5' };
        case 'accommodation':
          return { color: '#10b981', weight: 2, fillOpacity: 0.1 };
        default:
          return { color: '#6b7280', weight: 2, fillOpacity: 0.1 };
      }
    }
  }).addTo(map);
  map.fitBounds(geoJsonLayer.getBounds());
  return geoJsonLayer;
}

<<<<<<< HEAD
// Example HR office point feature (NYC -> KL)
export const exampleOfficeLocation: Feature<any> = {
  type: 'Feature' as const,
  geometry: {
    type: 'Point' as const,
    coordinates: [101.6869, 3.1390] // KL coordinates
=======
// Example HR office point feature (KL)
export const exampleOfficeLocation: Feature<{ type: 'Point'; coordinates: number[] }, HrGeoJsonProperties> = {
  type: 'Feature' as const,
  geometry: {
    type: 'Point' as const,
    coordinates: [101.6869, 3.1390]
>>>>>>> 237f310 (Add libraries, services and application logic)
  },
  properties: {
    name: 'KL Head Office',
    popupContent: '<b>Kuala Lumpur Office</b><br>Foreign Worker Management HQ (PDPA Compliant)'
<<<<<<< HEAD
  } as HrGeoJsonProperties
};

// Malaysian worksite geofences example
export const malaysiaWorksiteGeofences: GeoJSON.FeatureCollection<any, HrGeoJsonProperties> = {
=======
  }
};

// Malaysian worksite geofences example
export const malaysiaWorksiteGeofences: {
  type: 'FeatureCollection';
  features: Array<Feature<{ type: 'Polygon'; coordinates: number[][][] }, HrGeoJsonProperties>>;
} = {
>>>>>>> 237f310 (Add libraries, services and application logic)
  type: 'FeatureCollection' as const,
  features: [
    {
      type: 'Feature' as const,
      geometry: {
        type: 'Polygon' as const,
        coordinates: [[
          [101.686, 3.139],
          [101.688, 3.139],
          [101.688, 3.141],
          [101.686, 3.141],
          [101.686, 3.139]
        ]]
      },
      properties: {
        name: 'Selangor Worksite A (JTK Approved)',
<<<<<<< HEAD
        type: 'worksite' as const,
        status: 'active' as const,
=======
        type: 'worksite',
        status: 'active',
>>>>>>> 237f310 (Add libraries, services and application logic)
        workerCount: 45
      }
    },
    {
      type: 'Feature' as const,
      geometry: {
        type: 'Polygon' as const,
        coordinates: [[
          [101.65, 3.15],
          [101.67, 3.15],
          [101.67, 3.17],
          [101.65, 3.17],
          [101.65, 3.15]
        ]]
      },
      properties: {
        name: 'KL Accommodation Zone',
<<<<<<< HEAD
        type: 'accommodation' as const,
        status: 'active' as const,
=======
        type: 'accommodation',
        status: 'active',
>>>>>>> 237f310 (Add libraries, services and application logic)
        workerCount: 120
      }
    }
  ]
};
<<<<<<< HEAD

=======
>>>>>>> 237f310 (Add libraries, services and application logic)
