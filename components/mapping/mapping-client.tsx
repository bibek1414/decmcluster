"use client";

import { useState } from "react";
import { Map } from "lucide-react";
import LeafletMapView from "./leaflet-map-view";
import MapRegistry from "./map-registry";

export default function MappingClient() {
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
                Interactive coordinates, evacuation shelter mapping, and Vanuatu spatial layers
              </p>
            </div>
          </div>
        </div>

        {/* Leaflet OpenStreetMap View - Interactive Spatial Map */}
        <LeafletMapView
          selectedProvince={selectedProvince}
          onProvinceChange={setSelectedProvince}
          selectedCoordinates={selectedCoordinates}
          onCoordinatesChange={setSelectedCoordinates}
        />
      </div>

      {/* Vanuatu Volcanoes Mapped Catalog & Downloadable Formats */}

      {/* Map Registry Catalog Below */}
      <MapRegistry />
    </div>
  );
}
