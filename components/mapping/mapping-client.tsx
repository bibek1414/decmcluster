"use client";

import { useState } from "react";
import { Map } from "lucide-react";
import SVGMapView from "./svg-map-view";
import LeafletMapView from "./leaflet-map-view";
import MapRegistry from "./map-registry";

interface MapItem {
  id: string;
  type: "center" | "hazard" | "road" | "volcano";
  title: string;
  desc: string;
  stats?: Record<string, string | number>;
}

export default function MappingClient() {
  const [selectedItem, setSelectedItem] = useState<MapItem | null>(null);
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [selectedCoordinates, setSelectedCoordinates] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  return (
    <div className="space-y-8 flex flex-col">
      <div className="bg-transparent sm:bg-card text-card-foreground sm:rounded-2xl p-0 sm:p-6 md:p-8 border-0 sm:border border-border space-y-6">
        {/* Header section */}
        <div className="border-b border-border pb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-primary/10 text-primary">
              <Map className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-primary">
                GIS & Spatial Mapping
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                Interactive coordinates and evacuation shelter mapping
              </p>
            </div>
          </div>
        </div>

        {/* SVG Map View - Vanuatu Archipelago Overview */}
        <SVGMapView onItemClick={setSelectedItem} selectedItem={selectedItem} />

        {/* Leaflet Map View - Interactive EC Location Map */}
        <LeafletMapView
          selectedProvince={selectedProvince}
          onProvinceChange={setSelectedProvince}
          selectedCoordinates={selectedCoordinates}
          onCoordinatesChange={setSelectedCoordinates}
        />
      </div>

      {/* Map Registry Catalog Below */}
      <MapRegistry />
    </div>
  );
}
