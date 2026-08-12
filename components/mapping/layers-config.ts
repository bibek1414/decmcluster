export interface LayerConfig {
  id: string;
  name: string;
  group: string;
  url: string;
  type: 'point' | 'line' | 'polygon';
  defaultOn: boolean;
  color?: string;
  style?: {
    color: string;
    weight: number;
    fillOpacity?: number;
    dashArray?: string;
  };
}

export interface TileProvider {
  id: string;
  name: string;
  url: string;
  attribution: string;
  maxZoom: number;
}

export const TILE_PROVIDERS: Record<string, TileProvider> = {
  openstreetmap: {
    id: "openstreetmap",
    name: "OpenStreetMap",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors",
    maxZoom: 19
  }
};

export const LAYERS: LayerConfig[] = [
  // Administrative Boundaries
  {
    id: 'provinces',
    name: 'Provinces',
    group: 'Administrative Boundaries',
    url: '/data/admin/vut_provinces.geojson',
    type: 'polygon',
    defaultOn: false,
    style: { color: '#1f4e78', weight: 2.5, fillOpacity: 0.08 }
  },
  {
    id: 'area_councils',
    name: 'Area Councils',
    group: 'Administrative Boundaries',
    url: '/data/admin/vut_area_councils.geojson',
    type: 'polygon',
    defaultOn: false,
    style: { color: '#5b7f95', weight: 1.5, fillOpacity: 0.05 }
  },
  {
    id: 'islands',
    name: 'Islands',
    group: 'Administrative Boundaries',
    url: '/data/admin/vut_islands.geojson',
    type: 'polygon',
    defaultOn: false,
    style: { color: '#7a8b99', weight: 1.2, fillOpacity: 0.04 }
  },

  // Places
  {
    id: 'settlements',
    name: 'Settlements / Villages',
    group: 'Places',
    url: '/data/places/vut_settlements.geojson',
    type: 'point',
    defaultOn: false,
    color: '#4b5563'
  },

  // Transport
  {
    id: 'roads',
    name: 'Roads & Ring Highways',
    group: 'Transport',
    url: '/data/transport/vut_roads.geojson',
    type: 'line',
    defaultOn: false,
    style: { color: '#dc2626', weight: 3.5, fillOpacity: 0.8 }
  },
  {
    id: 'airports',
    name: 'Airports & Airstrips',
    group: 'Transport',
    url: '/data/transport/vut_airports.geojson',
    type: 'point',
    defaultOn: false,
    color: '#2563eb'
  },
  {
    id: 'ports',
    name: 'Ports & Wharves',
    group: 'Transport',
    url: '/data/transport/vut_ports_wharves.geojson',
    type: 'point',
    defaultOn: false,
    color: '#0284c7'
  },

  // Services
  {
    id: 'health',
    name: 'Health Facilities',
    group: 'Services',
    url: '/data/services/vut_health_facilities.geojson',
    type: 'point',
    defaultOn: false,
    color: '#e11d48'
  },
  {
    id: 'schools',
    name: 'Schools & Colleges',
    group: 'Services',
    url: '/data/services/vut_schools.geojson',
    type: 'point',
    defaultOn: false,
    color: '#d97706'
  },

  // Hazards
  {
    id: 'volcanoes',
    name: 'Volcanoes',
    group: 'Hazards',
    url: '/data/hazards/vut_volcanoes.geojson',
    type: 'point',
    defaultOn: false,
    color: '#991b1b'
  },
  {
    id: 'volcano_hazard',
    name: 'Volcano Hazard Zones',
    group: 'Hazards',
    url: '/data/hazards/vut_volcano_hazard_zones.geojson',
    type: 'polygon',
    defaultOn: false,
    style: { color: '#b91c1c', weight: 2, fillOpacity: 0.25 }
  },
  {
    id: 'tsunami',
    name: 'Tsunami Evacuation Zones',
    group: 'Hazards',
    url: '/data/hazards/vut_tsunami_zones.geojson',
    type: 'polygon',
    defaultOn: false,
    style: { color: '#0284c7', weight: 2, fillOpacity: 0.2 }
  },

  // DECM Operational
  {
    id: 'evacuation_centres',
    name: 'Evacuation Centres',
    group: 'DECM Operational',
    url: '/data/decm/evacuation_centres.geojson',
    type: 'point',
    defaultOn: false,
    color: '#10b981'
  },
  {
    id: 'displacement',
    name: 'Displacement Locations',
    group: 'DECM Operational',
    url: '/data/decm/displacement_locations.geojson',
    type: 'point',
    defaultOn: false,
    color: '#f97316'
  },
  {
    id: 'assessments',
    name: 'Assessment Locations',
    group: 'DECM Operational',
    url: '/data/decm/assessment_locations.geojson',
    type: 'point',
    defaultOn: false,
    color: '#8b5cf6'
  }
];
