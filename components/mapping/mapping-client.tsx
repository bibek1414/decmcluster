"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import { Map, X, Tent, Users, Shield, CheckCircle2 } from "lucide-react";
import { useEvacuationCentresStats, useEvacuationCentreLocations } from "@/hooks/use-dashboard";
import MapRegistry from "./map-registry";

export default function MappingClient() {
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [selectedCoordinates, setSelectedCoordinates] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  // Fetch live stats & locations from backend
  const { data: stats, isLoading: statsLoading } = useEvacuationCentresStats({
    province: selectedProvince || undefined,
    latitude: selectedCoordinates?.latitude,
    longitude: selectedCoordinates?.longitude,
  });

  const { data: locations, isLoading: locationsLoading } = useEvacuationCentreLocations({
    province: selectedProvince || undefined,
  });

  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [map, setMap] = useState<any>(null);
  const tileLayerRef = useRef<any>(null);

  // Dynamically load Leaflet library on client side
  useEffect(() => {
    if (typeof window === "undefined") return;

    const hasScript = !!(window as any).L;
    const hasCss = !!document.querySelector('link[href*="leaflet.css"]');

    if (hasScript && hasCss) {
      setMapLoaded(true);
      return;
    }

    let cssLoaded = hasCss;
    let jsLoaded = hasScript;

    const checkLoaded = () => {
      if (cssLoaded && jsLoaded) {
        setMapLoaded(true);
      }
    };

    if (!hasCss) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      link.onload = () => {
        cssLoaded = true;
        checkLoaded();
      };
      link.onerror = () => {
        cssLoaded = true;
        checkLoaded();
      };
      document.head.appendChild(link);
    }

    if (!hasScript) {
      const script = document.createElement("script");
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.async = true;
      script.onload = () => {
        jsLoaded = true;
        checkLoaded();
      };
      script.onerror = () => {
        jsLoaded = true;
        checkLoaded();
      };
      document.body.appendChild(script);
    }
  }, []);

  // Initialize Map ONCE when Leaflet is loaded
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;
    const L = (window as any).L;
    if (!L || map) return;

    let activeMap: any = null;

    const initMap = () => {
      if (!mapRef.current) return;
      activeMap = L.map(mapRef.current, {
        zoomControl: true,
        scrollWheelZoom: false,
        preferCanvas: false,
      }).setView([-16.5, 168.0], 7);

      tileLayerRef.current = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        crossOrigin: true,
      }).addTo(activeMap);

      setMap(activeMap);

      requestAnimationFrame(() => {
        activeMap.invalidateSize();
        setTimeout(() => activeMap.invalidateSize(), 300);
        setTimeout(() => activeMap.invalidateSize(), 800);
      });
    };

    requestAnimationFrame(initMap);

    return () => {
      if (activeMap) {
        activeMap.remove();
      }
      setMap(null);
      tileLayerRef.current = null;
    };
  }, [mapLoaded]);

  // Update Markers when locations or filters change
  useEffect(() => {
    const L = (window as any).L;
    if (!map || !L || !locations) return;

    map.eachLayer((layer: any) => {
      if (layer !== tileLayerRef.current) map.removeLayer(layer);
    });

    const validCoords: [number, number][] = [];

    locations.forEach((loc) => {
      if (loc.latitude === 0 && loc.longitude === 0) return;
      validCoords.push([loc.latitude, loc.longitude]);

      let color = "#ef4444";
      let statusName = "Not approved / unknown";
      if (loc.is_ec_govt_approved) {
        color = "#10b981";
        statusName = "Government approved";
      } else if (loc.is_ec_owner_approved) {
        color = "#3b82f6";
        statusName = "Owner approved only";
      }

      // Calculate radius based on capacity (Dot size = recorded internal capacity)
      const cap = (loc as any).capacity_hhs || (loc as any).capacity_persons || (loc as any).hhs || 20;
      const radiusSize = Math.max(6, Math.min(18, Math.sqrt(cap) * 1.2));

      const isSelected =
        selectedCoordinates !== null &&
        selectedCoordinates.latitude === loc.latitude &&
        selectedCoordinates.longitude === loc.longitude;

      const marker = L.circleMarker([loc.latitude, loc.longitude], {
        radius: isSelected ? radiusSize + 4 : radiusSize,
        fillColor: color,
        color: isSelected ? "#eab308" : "#ffffff",
        weight: isSelected ? 3.5 : 1.5,
        opacity: 1,
        fillOpacity: isSelected ? 1 : 0.85,
      }).addTo(map);

      const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${loc.latitude},${loc.longitude}`;
      marker.bindPopup(`
        <div style="font-family: sans-serif; font-size: 12px; padding: 4px; min-width: 190px;">
          <h4 style="margin: 0 0 6px 0; font-weight: bold; color: #1e293b; font-size: 13px;">${loc.compound_name}</h4>
          <p style="margin: 0 0 8px 0; color: #475569; line-height: 1.4;">
            <strong>Province:</strong> ${loc.province || "N/A"}<br/>
            <strong>Capacity:</strong> ${cap} HHs<br/>
            <strong>Status:</strong> <span style="color: ${color}; font-weight: bold;">${statusName}</span>
          </p>
          <a href="${googleMapsUrl}" target="_blank" rel="noopener noreferrer"
             style="display: block; width: 100%; background-color: #2563eb; color: white; padding: 5px 8px; border-radius: 4px; text-decoration: none; font-weight: 600; text-align: center; box-sizing: border-box; font-size: 11px;">
             View on Google Maps
          </a>
        </div>
      `);

      marker.on("click", () => {
        setSelectedCoordinates({ latitude: loc.latitude, longitude: loc.longitude });
      });

      if (isSelected) {
        marker.openPopup();
      }
    });

    if (selectedCoordinates) {
      map.setView([selectedCoordinates.latitude, selectedCoordinates.longitude], 12);
    } else if (validCoords.length > 0 && selectedProvince) {
      map.fitBounds(L.latLngBounds(validCoords), { padding: [40, 40] });
    } else {
      map.setView([-16.5, 168.0], 7);
    }

    requestAnimationFrame(() => map.invalidateSize());
  }, [map, locations, selectedProvince, selectedCoordinates]);

  // Province Breakdown
  const provinceBreakdown = useMemo(() => {
    if (!stats?.ec_by_province) return [];
    const items = stats.ec_by_province.map((item) => ({
      name: item.province.replace(" Province", "").trim(),
      value: item.count,
    }));
    return items.sort((a, b) => b.value - a.value);
  }, [stats]);

  const maxProvinceVal = useMemo(() => {
    if (provinceBreakdown.length === 0) return 1;
    return Math.max(...provinceBreakdown.map((i) => i.value), 1);
  }, [provinceBreakdown]);

  const showLoading = statsLoading || locationsLoading;

  return (
    <div className="space-y-8 flex flex-col">
      <div className="bg-transparent sm:bg-card text-card-foreground sm:rounded-2xl p-0 sm:p-6 md:p-8 border-0 sm:border border-border space-y-6">
        {/* Page Header */}
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
                EC location map by approval status & spatial data catalog
              </p>
            </div>
          </div>
        </div>

        {/* Map-Related Key Figures Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
          <div className="p-4 rounded-xl border border-primary/30 bg-primary/5 flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
              <Tent className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-foreground">
                {(stats?.total_ec || 0).toLocaleString()}
              </h3>
              <p className="text-[11px] font-bold text-muted-foreground">Total ECs Mapped</p>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-foreground">
                {(stats?.is_govt_approved || 0).toLocaleString()}
              </h3>
              <p className="text-[11px] font-bold text-muted-foreground">Govt Approved</p>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-blue-500/30 bg-blue-500/5 flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-600">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-foreground">
                {stats?.readiness_indicators?.is_ec_owner_approved || 0}%
              </h3>
              <p className="text-[11px] font-bold text-muted-foreground">Owner Approved</p>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-primary/30 bg-primary/5 flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-foreground">
                {(stats?.total_internal_capacity || 0).toLocaleString()}
              </h3>
              <p className="text-[11px] font-bold text-muted-foreground">Internal Capacity</p>
            </div>
          </div>
        </div>

        {/* Map Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Main Map Card */}
          <div className="lg:col-span-2 bg-card text-card-foreground rounded-xl border border-border p-5 shadow-xs flex flex-col justify-between">
            {/* Map Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-foreground">
                  EC location map by approval status
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5 font-medium">
                  Dot size = recorded internal capacity
                </p>
              </div>

              {/* Province Selector Dropdown */}
              <div className="flex items-center space-x-2 shrink-0">
                {(selectedProvince || selectedCoordinates) && (
                  <button
                    onClick={() => {
                      setSelectedProvince(null);
                      setSelectedCoordinates(null);
                    }}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] font-bold bg-muted hover:bg-muted-foreground/10 text-muted-foreground hover:text-foreground rounded-lg transition-colors cursor-pointer"
                  >
                    <X className="h-3 w-3" />
                    <span>Clear Filter</span>
                  </button>
                )}
                <select
                  value={selectedProvince || ""}
                  onChange={(e) => {
                    setSelectedProvince(e.target.value || null);
                    setSelectedCoordinates(null);
                  }}
                  className="text-xs font-bold bg-muted border border-border rounded-lg px-3 py-1.5 text-foreground cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">All Provinces</option>
                  <option value="Malampa">Malampa</option>
                  <option value="Penama">Penama</option>
                  <option value="Sanma">Sanma</option>
                  <option value="Shefa">Shefa</option>
                  <option value="Tafea">Tafea</option>
                  <option value="Torba">Torba</option>
                </select>
              </div>
            </div>

            {/* Map Viewport Container */}
            <div
              className="mt-4 relative w-full rounded-xl border border-border z-0 overflow-hidden"
              style={{ height: "480px" }}
            >
              {(!mapLoaded || showLoading) && (
                <div className="absolute inset-0 flex items-center justify-center bg-card/75 backdrop-blur-[2px] rounded-xl z-[1000]">
                  <div className="flex flex-col items-center space-y-2 bg-popover px-5 py-3.5 rounded-xl border border-border shadow-md">
                    <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs font-semibold text-muted-foreground">
                      {!mapLoaded ? "Loading interactive map..." : "Updating spatial data..."}
                    </span>
                  </div>
                </div>
              )}
              <div
                ref={mapRef}
                style={{
                  width: "100%",
                  height: "100%",
                }}
              />
            </div>

            {/* Map Legend */}
            <div className="mt-4 flex flex-wrap gap-4 pt-3.5 border-t border-border">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider w-full">
                Approval Status Legend
              </span>
              <div className="flex items-center space-x-2">
                <span className="h-3 w-3 rounded-full bg-[#10b981] border border-white shadow-xs" />
                <span className="text-xs font-semibold text-foreground">Government approved</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="h-3 w-3 rounded-full bg-[#3b82f6] border border-white shadow-xs" />
                <span className="text-xs font-semibold text-foreground">Owner approved only</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="h-3 w-3 rounded-full bg-[#ef4444] border border-white shadow-xs" />
                <span className="text-xs font-semibold text-foreground">Not approved / unknown</span>
              </div>
            </div>
          </div>

          {/* Right Column: ECs by Province Breakdown */}
          <div className="bg-card text-card-foreground rounded-xl border border-border p-5 shadow-xs space-y-4">
            <div>
              <h3 className="text-sm font-bold text-foreground">Mapped ECs by province</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Click province to filter map view</p>
            </div>
            <div className="space-y-3.5 pt-2 border-t border-border">
              {provinceBreakdown.map((prov) => {
                const percentage = Math.round((prov.value / maxProvinceVal) * 100);
                const isSelected = selectedProvince?.toLowerCase() === prov.name.toLowerCase();
                return (
                  <button
                    key={prov.name}
                    onClick={() => {
                      setSelectedProvince(isSelected ? null : prov.name);
                      setSelectedCoordinates(null);
                    }}
                    className="w-full text-left block focus:outline-none group cursor-pointer"
                  >
                    <div className="flex justify-between text-xs font-semibold text-foreground mb-1">
                      <span
                        className={`group-hover:text-primary transition-colors flex items-center gap-1.5 ${
                          isSelected ? "text-primary font-bold" : ""
                        }`}
                      >
                        {prov.name}
                        {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
                      </span>
                      <span className="text-primary font-bold">{prov.value} ECs</span>
                    </div>
                    <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          isSelected ? "bg-primary" : "bg-blue-900 group-hover:bg-blue-800"
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Map Registry Catalog Below */}
      <MapRegistry />
    </div>
  );
}



