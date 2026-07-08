import * as L from 'leaflet';
import type { GeoJsonObject, Feature, Geometry, GeoJsonProperties } from 'geojson';
import type { HrGeoJsonProperties } from '@/types/geolocation';

export function addGeoJsonToMap(
  geoJsonData: GeoJsonObject, 
  map: L.Map
): L.GeoJSON {
  const geoJsonLayer = L.geoJSON(geoJsonData, {
    onEachFeature: (feature: Feature<Geometry, GeoJsonProperties>, layer: L.Layer) => {
      const props = feature.properties;
      if (!props) return;
      if (props.popupContent) {
        layer.bindPopup(props.popupContent);
      }
      if ((props as HrGeoJsonProperties).name) {
        layer.bindTooltip((props as HrGeoJsonProperties).name, { permanent: false, direction: 'top' });
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

// Example HR office point feature (NYC -> KL)
export const exampleOfficeLocation: Feature<any> = {
  type: 'Feature' as const,
  geometry: {
    type: 'Point' as const,
    coordinates: [101.6869, 3.1390] // KL coordinates
  },
  properties: {
    name: 'KL Head Office',
    popupContent: '<b>Kuala Lumpur Office</b><br>Foreign Worker Management HQ (PDPA Compliant)'
  } as HrGeoJsonProperties
};

// Malaysian worksite geofences example
export const malaysiaWorksiteGeofences: GeoJSON.FeatureCollection<any, HrGeoJsonProperties> = {
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
        type: 'worksite' as const,
        status: 'active' as const,
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
        type: 'accommodation' as const,
        status: 'active' as const,
        workerCount: 120
      }
    }
  ]
};

