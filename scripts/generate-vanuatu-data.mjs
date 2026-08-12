import fs from 'node:fs/promises';
import path from 'node:path';

const dirs = [
  'public/data/admin',
  'public/data/places',
  'public/data/transport',
  'public/data/services',
  'public/data/hazards',
  'public/data/decm'
];

for (const d of dirs) {
  await fs.mkdir(d, { recursive: true });
}

// 1. PROVINCES (Polygons)
const provinces = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { id: "shefa", name: "Shefa Province", code: "VU-MAP-01", capital: "Port Vila", population: 104500 },
      geometry: {
        type: "Polygon",
        coordinates: [[[168.0, -17.9], [168.6, -17.9], [168.6, -17.3], [168.0, -17.3], [168.0, -17.9]]]
      }
    },
    {
      type: "Feature",
      properties: { id: "sanma", name: "Sanma Province", code: "VU-MAP-02", capital: "Luganville", population: 61300 },
      geometry: {
        type: "Polygon",
        coordinates: [[[166.5, -15.8], [167.4, -15.8], [167.4, -14.8], [166.5, -14.8], [166.5, -15.8]]]
      }
    },
    {
      type: "Feature",
      properties: { id: "malampa", name: "Malampa Province", code: "VU-MAP-03", capital: "Lakatoro", population: 42700 },
      geometry: {
        type: "Polygon",
        coordinates: [[[167.1, -16.6], [168.3, -16.6], [168.3, -15.9], [167.1, -15.9], [167.1, -16.6]]]
      }
    },
    {
      type: "Feature",
      properties: { id: "penama", name: "Penama Province", code: "VU-MAP-04", capital: "Saratamata", population: 35600 },
      geometry: {
        type: "Polygon",
        coordinates: [[[167.6, -16.1], [168.4, -16.1], [168.4, -14.9], [167.6, -14.9], [167.6, -16.1]]]
      }
    },
    {
      type: "Feature",
      properties: { id: "tafea", name: "Tafea Province", code: "VU-MAP-05", capital: "Isangel", population: 43200 },
      geometry: {
        type: "Polygon",
        coordinates: [[[168.9, -20.3], [170.3, -20.3], [170.3, -18.6], [168.9, -18.6], [168.9, -20.3]]]
      }
    },
    {
      type: "Feature",
      properties: { id: "torba", name: "Torba Province", code: "VU-MAP-06", capital: "Sola", population: 11400 },
      geometry: {
        type: "Polygon",
        coordinates: [[[166.4, -14.4], [167.8, -14.4], [167.8, -13.0], [166.4, -13.0], [166.4, -14.4]]]
      }
    }
  ]
};

// 2. AREA COUNCILS
const areaCouncils = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "Efate Urban (Port Vila)", province: "Shefa", code: "AC-101" },
      geometry: { type: "Polygon", coordinates: [[[168.28, -17.77], [168.35, -17.77], [168.35, -17.70], [168.28, -17.70], [168.28, -17.77]]] }
    },
    {
      type: "Feature",
      properties: { name: "North Efate Area Council", province: "Shefa", code: "AC-102" },
      geometry: { type: "Polygon", coordinates: [[[168.20, -17.58], [168.52, -17.58], [168.52, -17.42], [168.20, -17.42], [168.20, -17.58]]] }
    },
    {
      type: "Feature",
      properties: { name: "Luganville Urban Council", province: "Sanma", code: "AC-201" },
      geometry: { type: "Polygon", coordinates: [[[167.14, -15.54], [167.22, -15.54], [167.22, -15.48], [167.14, -15.48], [167.14, -15.54]]] }
    },
    {
      type: "Feature",
      properties: { name: "West Tanna Area Council", province: "Tafea", code: "AC-501" },
      geometry: { type: "Polygon", coordinates: [[[169.20, -19.58], [169.32, -19.58], [169.32, -19.42], [169.20, -19.42], [169.20, -19.58]]] }
    },
    {
      type: "Feature",
      properties: { name: "Central Malekula Council", province: "Malampa", code: "AC-301" },
      geometry: { type: "Polygon", coordinates: [[[167.35, -16.18], [167.48, -16.18], [167.48, -16.05], [167.35, -16.05], [167.35, -16.18]]] }
    }
  ]
};

// 3. ISLANDS
const islands = {
  type: "FeatureCollection",
  features: [
    { type: "Feature", properties: { name: "Efate Island", province: "Shefa", area_sqkm: 899 }, geometry: { type: "Polygon", coordinates: [[[168.15, -17.82], [168.58, -17.82], [168.58, -17.50], [168.15, -17.50], [168.15, -17.82]]] } },
    { type: "Feature", properties: { name: "Espiritu Santo Island", province: "Sanma", area_sqkm: 3955 }, geometry: { type: "Polygon", coordinates: [[[166.60, -15.65], [167.25, -15.65], [167.25, -14.90], [166.60, -14.90], [166.60, -15.65]]] } },
    { type: "Feature", properties: { name: "Tanna Island", province: "Tafea", area_sqkm: 550 }, geometry: { type: "Polygon", coordinates: [[[169.18, -19.62], [169.48, -19.62], [169.48, -19.35], [169.18, -19.35], [169.18, -19.62]]] } },
    { type: "Feature", properties: { name: "Malekula Island", province: "Malampa", area_sqkm: 2041 }, geometry: { type: "Polygon", coordinates: [[[167.18, -16.55], [167.52, -16.55], [167.52, -15.98], [167.18, -15.98], [167.18, -16.55]]] } },
    { type: "Feature", properties: { name: "Ambae Island", province: "Penama", area_sqkm: 402 }, geometry: { type: "Polygon", coordinates: [[[167.68, -15.48], [167.98, -15.48], [167.98, -15.28], [167.68, -15.28], [167.68, -15.48]]] } },
    { type: "Feature", properties: { name: "Pentecost Island", province: "Penama", area_sqkm: 490 }, geometry: { type: "Polygon", coordinates: [[[168.12, -16.02], [168.25, -16.02], [168.25, -15.60], [168.12, -15.60], [168.12, -16.02]]] } },
    { type: "Feature", properties: { name: "Ambrym Island", province: "Malampa", area_sqkm: 677 }, geometry: { type: "Polygon", coordinates: [[[167.92, -16.32], [168.22, -16.32], [168.22, -16.18], [167.92, -16.18], [167.92, -16.32]]] } }
  ]
};

// 4. ROADS (LineString features for Vanuatu Highways)
const roads = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "Efate Ring Road (Port Vila Coastal Loop)", type: "Primary Highway", province: "Shefa", surface: "Paved/Sealed", condition: "Good" },
      geometry: {
        type: "LineString",
        coordinates: [
          [168.320, -17.740], [168.280, -17.720], [168.250, -17.680], [168.240, -17.620],
          [168.290, -17.550], [168.350, -17.540], [168.450, -17.560], [168.520, -17.650],
          [168.480, -17.720], [168.400, -17.760], [168.320, -17.740]
        ]
      }
    },
    {
      type: "Feature",
      properties: { name: "Santo Main East Coast Highway", type: "Primary Highway", province: "Sanma", surface: "Paved", condition: "Good" },
      geometry: {
        type: "LineString",
        coordinates: [
          [167.180, -15.510], [167.195, -15.420], [167.220, -15.350], [167.210, -15.220],
          [167.150, -15.120], [167.065, -15.045]
        ]
      }
    },
    {
      type: "Feature",
      properties: { name: "Tanna West Coast Highway", type: "Secondary Road", province: "Tafea", surface: "Gravel/Unpaved", condition: "Fair" },
      geometry: {
        type: "LineString",
        coordinates: [
          [169.225, -19.455], [169.250, -19.500], [169.270, -19.530], [169.280, -19.560]
        ]
      }
    },
    {
      type: "Feature",
      properties: { name: "Tanna Cross Island Yasur Volcano Road", type: "Feeder Road", province: "Tafea", surface: "Volcanic Ash/Dirt", condition: "Requires 4WD" },
      geometry: {
        type: "LineString",
        coordinates: [
          [169.270, -19.530], [169.340, -19.520], [169.410, -19.525], [169.445, -19.530]
        ]
      }
    },
    {
      type: "Feature",
      properties: { name: "Malekula East Coast Trunk Road", type: "Secondary Road", province: "Malampa", surface: "Gravel", condition: "Fair" },
      geometry: {
        type: "LineString",
        coordinates: [
          [167.399, -16.082], [167.420, -16.100], [167.435, -16.140], [167.450, -16.250], [167.480, -16.420]
        ]
      }
    },
    {
      type: "Feature",
      properties: { name: "Pentecost Central Island Highway", type: "Secondary Road", province: "Penama", surface: "Gravel", condition: "Fair" },
      geometry: {
        type: "LineString",
        coordinates: [
          [168.180, -15.300], [168.175, -15.500], [168.165, -15.820], [168.160, -16.000]
        ]
      }
    }
  ]
};

// 5. AIRPORTS
const airports = {
  type: "FeatureCollection",
  features: [
    { type: "Feature", properties: { name: "Bauerfield International Airport (VLI)", code: "VLI", city: "Port Vila", island: "Efate", province: "Shefa", type: "International Airport", runway_m: 2600 }, geometry: { type: "Point", coordinates: [168.320, -17.699] } },
    { type: "Feature", properties: { name: "Santo Pekoa International Airport (SON)", code: "SON", city: "Luganville", island: "Espiritu Santo", province: "Sanma", type: "International Airport", runway_m: 2000 }, geometry: { type: "Point", coordinates: [167.220, -15.505] } },
    { type: "Feature", properties: { name: "Whitegrass International Airport (TAH)", code: "TAH", city: "Lenakel", island: "Tanna", province: "Tafea", type: "Regional Airport", runway_m: 1480 }, geometry: { type: "Point", coordinates: [169.225, -19.455] } },
    { type: "Feature", properties: { name: "Norsup Airport (NUS)", code: "NUS", city: "Lakatoro", island: "Malekula", province: "Malampa", type: "Domestic Airstrip", runway_m: 950 }, geometry: { type: "Point", coordinates: [167.399, -16.082] } },
    { type: "Feature", properties: { name: "Craig Cove Airport (CCV)", code: "CCV", city: "Craig Cove", island: "Ambrym", province: "Malampa", type: "Domestic Airstrip", runway_m: 820 }, geometry: { type: "Point", coordinates: [167.921, -16.265] } },
    { type: "Feature", properties: { name: "Longana Airport (LOD)", code: "LOD", city: "Longana", island: "Ambae", province: "Penama", type: "Domestic Airstrip", runway_m: 780 }, geometry: { type: "Point", coordinates: [167.967, -15.305] } },
    { type: "Feature", properties: { name: "Sola Airport (SLH)", code: "SLH", city: "Sola", island: "Vanua Lava", province: "Torba", type: "Domestic Airstrip", runway_m: 850 }, geometry: { type: "Point", coordinates: [167.552, -13.854] } },
    { type: "Feature", properties: { name: "Ipota Airport (IPA)", code: "IPA", city: "Ipota", island: "Erromango", province: "Tafea", type: "Domestic Airstrip", runway_m: 900 }, geometry: { type: "Point", coordinates: [169.006, -18.810] } },
    { type: "Feature", properties: { name: "Linua Airstrip (TOH)", code: "TOH", city: "Linua", island: "Torres Islands", province: "Torba", type: "Remote Airstrip", runway_m: 700 }, geometry: { type: "Point", coordinates: [166.636, -13.257] } }
  ]
};

// 6. PORTS & WHARVES
const ports = {
  type: "FeatureCollection",
  features: [
    { type: "Feature", properties: { name: "Port Vila Main Wharf", code: "VU-VLI", city: "Port Vila", island: "Efate", province: "Shefa", type: "Deepwater Sea Port", depth_m: 12.5 }, geometry: { type: "Point", coordinates: [168.312, -17.745] } },
    { type: "Feature", properties: { name: "Lapetasi International Container Terminal", code: "VU-LPT", city: "Port Vila", island: "Efate", province: "Shefa", type: "Container Terminal", depth_m: 13.0 }, geometry: { type: "Point", coordinates: [168.318, -17.752] } },
    { type: "Feature", properties: { name: "Luganville Main International Wharf", code: "VU-SON", city: "Luganville", island: "Espiritu Santo", province: "Sanma", type: "Deepwater Sea Port", depth_m: 14.0 }, geometry: { type: "Point", coordinates: [167.170, -15.520] } },
    { type: "Feature", properties: { name: "Litzlitz Wharf", code: "VU-LTZ", city: "Lakatoro", island: "Malekula", province: "Malampa", type: "Inter-Island Ferry Dock", depth_m: 6.5 }, geometry: { type: "Point", coordinates: [167.435, -16.140] } },
    { type: "Feature", properties: { name: "Lenakel Wharf", code: "VU-LNK", city: "Lenakel", island: "Tanna", province: "Tafea", type: "Inter-Island Wharf", depth_m: 5.8 }, geometry: { type: "Point", coordinates: [169.265, -19.530] } },
    { type: "Feature", properties: { name: "Saratamata Wharf", code: "VU-STM", city: "Saratamata", island: "Ambae", province: "Penama", type: "Coastal Jetty", depth_m: 4.5 }, geometry: { type: "Point", coordinates: [167.980, -15.270] } }
  ]
};

// 7. SETTLEMENTS
const settlements = {
  type: "FeatureCollection",
  features: [
    { type: "Feature", properties: { name: "Port Vila", category: "Capital City", population: 51400, island: "Efate", province: "Shefa" }, geometry: { type: "Point", coordinates: [168.320, -17.733] } },
    { type: "Feature", properties: { name: "Luganville", category: "Provincial Town", population: 16300, island: "Espiritu Santo", province: "Sanma" }, geometry: { type: "Point", coordinates: [167.180, -15.510] } },
    { type: "Feature", properties: { name: "Lenakel", category: "Township", population: 4200, island: "Tanna", province: "Tafea" }, geometry: { type: "Point", coordinates: [169.268, -19.532] } },
    { type: "Feature", properties: { name: "Lakatoro", category: "Provincial Center", population: 1800, island: "Malekula", province: "Malampa" }, geometry: { type: "Point", coordinates: [167.420, -16.100] } },
    { type: "Feature", properties: { name: "Saratamata", category: "Provincial Center", population: 1200, island: "Ambae", province: "Penama" }, geometry: { type: "Point", coordinates: [167.980, -15.275] } },
    { type: "Feature", properties: { name: "Sola", category: "Provincial Center", population: 1100, island: "Vanua Lava", province: "Torba" }, geometry: { type: "Point", coordinates: [167.550, -13.850] } },
    { type: "Feature", properties: { name: "Mele Village", category: "Major Village", population: 3500, island: "Efate", province: "Shefa" }, geometry: { type: "Point", coordinates: [168.260, -17.685] } },
    { type: "Feature", properties: { name: "Port Olry", category: "Coastal Village", population: 2800, island: "Espiritu Santo", province: "Sanma" }, geometry: { type: "Point", coordinates: [167.065, -15.045] } },
    { type: "Feature", properties: { name: "Melsisi", category: "Coastal Settlement", population: 1500, island: "Pentecost", province: "Penama" }, geometry: { type: "Point", coordinates: [168.165, -15.980] } }
  ]
};

// 8. HEALTH FACILITIES
const healthFacilities = {
  type: "FeatureCollection",
  features: [
    { type: "Feature", properties: { name: "Vila Central Hospital (VCH)", type: "National Referral Hospital", beds: 220, island: "Efate", province: "Shefa", emergency_phone: "112" }, geometry: { type: "Point", coordinates: [168.322, -17.742] } },
    { type: "Feature", properties: { name: "Northern Provincial Hospital", type: "Provincial Referral Hospital", beds: 110, island: "Espiritu Santo", province: "Sanma", emergency_phone: "36345" }, geometry: { type: "Point", coordinates: [167.185, -15.512] } },
    { type: "Feature", properties: { name: "Lenakel Provincial Hospital", type: "Provincial Hospital", beds: 45, island: "Tanna", province: "Tafea", emergency_phone: "88624" }, geometry: { type: "Point", coordinates: [169.270, -19.525] } },
    { type: "Feature", properties: { name: "Norsup Regional Hospital", type: "Regional Hospital", beds: 50, island: "Malekula", province: "Malampa", emergency_phone: "48410" }, geometry: { type: "Point", coordinates: [167.395, -16.078] } },
    { type: "Feature", properties: { name: "Lolowai Hospital", type: "District Hospital", beds: 30, island: "Ambae", province: "Penama", emergency_phone: "38330" }, geometry: { type: "Point", coordinates: [167.975, -15.285] } },
    { type: "Feature", properties: { name: "Sola Health Centre", type: "Health Centre", beds: 12, island: "Vanua Lava", province: "Torba", emergency_phone: "38510" }, geometry: { type: "Point", coordinates: [167.550, -13.850] } }
  ]
};

// 9. SCHOOLS
const schools = {
  type: "FeatureCollection",
  features: [
    { type: "Feature", properties: { name: "Malapoa College", level: "Secondary", students: 1200, island: "Efate", province: "Shefa" }, geometry: { type: "Point", coordinates: [168.305, -17.725] } },
    { type: "Feature", properties: { name: "Port Vila International School", level: "Primary & Secondary", students: 450, island: "Efate", province: "Shefa" }, geometry: { type: "Point", coordinates: [168.330, -17.738] } },
    { type: "Feature", properties: { name: "Matevulu College", level: "Secondary Boarding School", students: 850, island: "Espiritu Santo", province: "Sanma" }, geometry: { type: "Point", coordinates: [167.195, -15.420] } },
    { type: "Feature", properties: { name: "Ranwadi High School", level: "Secondary", students: 600, island: "Pentecost", province: "Penama" }, geometry: { type: "Point", coordinates: [168.180, -15.820] } },
    { type: "Feature", properties: { name: "Onesua Presbyterian College", level: "Secondary Boarding", students: 700, island: "Efate", province: "Shefa" }, geometry: { type: "Point", coordinates: [168.450, -17.550] } },
    { type: "Feature", properties: { name: "Tafea College", level: "Secondary", students: 650, island: "Tanna", province: "Tafea" }, geometry: { type: "Point", coordinates: [169.275, -19.535] } }
  ]
};

// 10. VOLCANOES
const volcanoes = {
  type: "FeatureCollection",
  features: [
    { type: "Feature", properties: { name: "Mount Yasur Volcano", type: "Active Cinder Cone", elevation_m: 361, alert_level: "Level 2 (Unstable)", island: "Tanna", province: "Tafea" }, geometry: { type: "Point", coordinates: [169.447, -19.532] } },
    { type: "Feature", properties: { name: "Manaro Voui Volcano", type: "Active Caldera / Shield", elevation_m: 1496, alert_level: "Level 2 (Unrest)", island: "Ambae", province: "Penama" }, geometry: { type: "Point", coordinates: [167.835, -15.380] } },
    { type: "Feature", properties: { name: "Mount Benbow Volcano", type: "Active Pyroclastic Cone", elevation_m: 1160, alert_level: "Level 2 (Unstable)", island: "Ambrym", province: "Malampa" }, geometry: { type: "Point", coordinates: [168.115, -16.245] } },
    { type: "Feature", properties: { name: "Mount Marum Volcano", type: "Active Lava Lake Cone", elevation_m: 1270, alert_level: "Level 2 (Unstable)", island: "Ambrym", province: "Malampa" }, geometry: { type: "Point", coordinates: [168.130, -16.255] } },
    { type: "Feature", properties: { name: "Lopevi Volcano Island", type: "Active Stratovolcano", elevation_m: 1413, alert_level: "Level 1 (Normal)", island: "Lopevi", province: "Malampa" }, geometry: { type: "Point", coordinates: [168.344, -16.507] } },
    { type: "Feature", properties: { name: "Mount Gharat Volcano", type: "Active Stratovolcano", elevation_m: 797, alert_level: "Level 1 (Normal)", island: "Gaua", province: "Torba" }, geometry: { type: "Point", coordinates: [167.500, -14.270] } }
  ]
};

// 11. HAZARD ZONES (Volcano & Tsunami)
const volcanoHazardZones = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "Ambae Manaro Red Hazard Exclusion Zone", risk: "Extreme Volcanic Ash & Lava Flow Risk", alert: "Red Alert", province: "Penama" },
      geometry: { type: "Polygon", coordinates: [[[167.75, -15.42], [167.92, -15.42], [167.92, -15.34], [167.75, -15.34], [167.75, -15.42]]] }
    },
    {
      type: "Feature",
      properties: { name: "Ambrym Central Caldera High Danger Zone", risk: "Toxic Gas & Volcanic Bomb Hazard", alert: "Orange Warning", province: "Malampa" },
      geometry: { type: "Polygon", coordinates: [[[168.05, -16.28], [168.18, -16.28], [168.18, -16.20], [168.05, -16.20], [168.05, -16.28]]] }
    },
    {
      type: "Feature",
      properties: { name: "Mount Yasur Crater 600m Exclusion Radius", risk: "Ejecta & Ash Fall Risk Zone", alert: "Yellow Warning", province: "Tafea" },
      geometry: { type: "Polygon", coordinates: [[[169.43, -19.54], [169.46, -19.54], [169.46, -19.52], [169.43, -19.52], [169.43, -19.54]]] }
    }
  ]
};

const tsunamiZones = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "Port Vila Mele Bay Coastal Tsunami Inundation Zone", elevation: "< 10m ASL", risk: "High Tsunami Inundation Zone", province: "Shefa" },
      geometry: { type: "Polygon", coordinates: [[[168.25, -17.75], [168.33, -17.75], [168.33, -17.67], [168.25, -17.67], [168.25, -17.75]]] }
    },
    {
      type: "Feature",
      properties: { name: "Luganville Segond Channel Tsunami Inundation Line", elevation: "< 8m ASL", risk: "Moderate Coastal Surging", province: "Sanma" },
      geometry: { type: "Polygon", coordinates: [[[167.14, -15.54], [167.22, -15.54], [167.22, -15.49], [167.14, -15.49], [167.14, -15.54]]] }
    }
  ]
};

// 12. DECM OPERATIONAL LAYERS
const evacuationCentres = {
  type: "FeatureCollection",
  features: [
    { type: "Feature", properties: { ec_name: "Freshwota School Shelter", compound_name: "Freshwota Primary Hall", province: "Shefa", capacity_hhs: 140, capacity_persons: 700, is_govt_approved: true, is_ec_owner_approved: true, status: "Active / Prepared" }, geometry: { type: "Point", coordinates: [168.328, -17.728] } },
    { type: "Feature", properties: { ec_name: "Mele Community Centre", compound_name: "Mele Village Hall", province: "Shefa", capacity_hhs: 95, capacity_persons: 475, is_govt_approved: true, is_ec_owner_approved: true, status: "Active / Prepared" }, geometry: { type: "Point", coordinates: [168.262, -17.682] } },
    { type: "Feature", properties: { ec_name: "Luganville Youth Center", compound_name: "Luganville Municipal Complex", province: "Sanma", capacity_hhs: 110, capacity_persons: 550, is_govt_approved: true, is_ec_owner_approved: true, status: "Active / Prepared" }, geometry: { type: "Point", coordinates: [167.182, -15.508] } },
    { type: "Feature", properties: { ec_name: "Lenakel Presbyterian Hall", compound_name: "Lenakel Parish Center", province: "Tafea", capacity_hhs: 80, capacity_persons: 400, is_govt_approved: false, is_ec_owner_approved: true, status: "Standby" }, geometry: { type: "Point", coordinates: [169.272, -19.528] } },
    { type: "Feature", properties: { ec_name: "Lakatoro Cultural Centre", compound_name: "Lakatoro Provincial Hall", province: "Malampa", capacity_hhs: 60, capacity_persons: 300, is_govt_approved: true, is_ec_owner_approved: true, status: "Active / Prepared" }, geometry: { type: "Point", coordinates: [167.422, -16.098] } },
    { type: "Feature", properties: { ec_name: "Saratamata Community Hall", compound_name: "North Ambae Relief Hub", province: "Penama", capacity_hhs: 75, capacity_persons: 375, is_govt_approved: true, is_ec_owner_approved: true, status: "Active / Prepared" }, geometry: { type: "Point", coordinates: [167.982, -15.272] } }
  ]
};

const displacementLocations = {
  type: "FeatureCollection",
  features: [
    { type: "Feature", properties: { location_name: "Ambae Volcano Relocation Camp A", idps: 340, operation: "Manaro Eruption", province: "Penama" }, geometry: { type: "Point", coordinates: [167.950, -15.260] } },
    { type: "Feature", properties: { location_name: "Santo Temporary Displacement Site", idps: 620, operation: "Cyclone Harold Displacement", province: "Sanma" }, geometry: { type: "Point", coordinates: [167.170, -15.495] } },
    { type: "Feature", properties: { location_name: "Port Vila Urban Informal Shelter Cluster", idps: 180, operation: "Cyclone Pam Emergency", province: "Shefa" }, geometry: { type: "Point", coordinates: [168.335, -17.745] } }
  ]
};

const assessmentLocations = {
  type: "FeatureCollection",
  features: [
    { type: "Feature", properties: { title: "Efate Rapid Assessment Zone 1", status: "Completed", team: "NDMO / DECM Cluster", date: "2026-02-10" }, geometry: { type: "Point", coordinates: [168.300, -17.710] } },
    { type: "Feature", properties: { title: "Santo Flood & Storm Damage Survey", status: "In Progress", team: "Red Cross / IOM", date: "2026-02-11" }, geometry: { type: "Point", coordinates: [167.200, -15.480] } }
  ]
};

await fs.writeFile('public/data/admin/vut_provinces.geojson', JSON.stringify(provinces, null, 2));
await fs.writeFile('public/data/admin/vut_area_councils.geojson', JSON.stringify(areaCouncils, null, 2));
await fs.writeFile('public/data/admin/vut_islands.geojson', JSON.stringify(islands, null, 2));
await fs.writeFile('public/data/transport/vut_roads.geojson', JSON.stringify(roads, null, 2));
await fs.writeFile('public/data/transport/vut_airports.geojson', JSON.stringify(airports, null, 2));
await fs.writeFile('public/data/transport/vut_ports_wharves.geojson', JSON.stringify(ports, null, 2));
await fs.writeFile('public/data/places/vut_settlements.geojson', JSON.stringify(settlements, null, 2));
await fs.writeFile('public/data/services/vut_health_facilities.geojson', JSON.stringify(healthFacilities, null, 2));
await fs.writeFile('public/data/services/vut_schools.geojson', JSON.stringify(schools, null, 2));
await fs.writeFile('public/data/hazards/vut_volcanoes.geojson', JSON.stringify(volcanoes, null, 2));
await fs.writeFile('public/data/hazards/vut_volcano_hazard_zones.geojson', JSON.stringify(volcanoHazardZones, null, 2));
await fs.writeFile('public/data/hazards/vut_tsunami_zones.geojson', JSON.stringify(tsunamiZones, null, 2));
await fs.writeFile('public/data/decm/evacuation_centres.geojson', JSON.stringify(evacuationCentres, null, 2));
await fs.writeFile('public/data/decm/displacement_locations.geojson', JSON.stringify(displacementLocations, null, 2));
await fs.writeFile('public/data/decm/assessment_locations.geojson', JSON.stringify(assessmentLocations, null, 2));

console.log("All Vanuatu GeoJSON datasets successfully generated!");
