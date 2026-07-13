"use client";

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
} from "react";
import {
  Tent,
  Users,
  Droplet,
  Shield,
  Heart,
  Activity,
  MapPin,
  X,
} from "lucide-react";
import {
  useEvacuationCentresStats,
  useEvacuationCentreLocations,
} from "@/hooks/use-dashboard";

export default function EvacuationCentresDashboard() {
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);

  // Fetch both stats and locations from backend filtered by province
  const { data: stats, isLoading: statsLoading } = useEvacuationCentresStats(
    selectedProvince || undefined,
  );
  const { data: locations, isLoading: locationsLoading } =
    useEvacuationCentreLocations(selectedProvince || undefined);

  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [map, setMap] = useState<any>(null);

  // Dynamically load Leaflet library on client-side
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check if both Leaflet script is loaded and stylesheet is present
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

  const tileLayerRef = useRef<any>(null);

  // ── Effect 1: Initialise map ONCE when Leaflet is ready ──────────────────
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

      tileLayerRef.current = L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          maxZoom: 19,
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          crossOrigin: true,
        },
      ).addTo(activeMap);

      setMap(activeMap);

      // Multi-step invalidateSize: RAF → 300 ms → 800 ms
      // Guarantees tiles appear even when the container was hidden on mount.
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

  // ── Effect 2: Update markers whenever locations or province filter changes ─
  useEffect(() => {
    const L = (window as any).L;
    if (!map || !L || !locations) return;

    // Remove all existing marker layers (keep tile layer)
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

      const marker = L.circleMarker([loc.latitude, loc.longitude], {
        radius: 6,
        fillColor: color,
        color: "#ffffff",
        weight: 1.5,
        opacity: 1,
        fillOpacity: 0.85,
      }).addTo(map);

      const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${loc.latitude},${loc.longitude}`;
      marker.bindPopup(`
        <div style="font-family: sans-serif; font-size: 12px; padding: 4px; min-width: 180px;">
          <h4 style="margin: 0 0 6px 0; font-weight: bold; color: #1e293b; font-size: 13px;">${loc.compound_name}</h4>
          <p style="margin: 0 0 8px 0; color: #475569; line-height: 1.4;">
            <strong>Province:</strong> ${loc.province || "N/A"}<br/>
            <strong>Status:</strong> <span style="color: ${color}; font-weight: bold;">${statusName}</span>
          </p>
          <a href="${googleMapsUrl}" target="_blank" rel="noopener noreferrer"
             style="display: block; width: 100%; background-color: #2563eb; color: white; padding: 5px 8px; border-radius: 4px; text-decoration: none; font-weight: 600; text-align: center; box-sizing: border-box; font-size: 11px;">
             View on Google Maps
          </a>
        </div>
      `);
    });

    if (validCoords.length > 0 && selectedProvince) {
      map.fitBounds(L.latLngBounds(validCoords), { padding: [40, 40] });
    } else {
      map.setView([-16.5, 168.0], 7);
    }

    // Ensure tiles are rendered after any layout shift
    requestAnimationFrame(() => map.invalidateSize());
  }, [map, locations, selectedProvince]);

  // Total statistics indicators mapping (Exactly match Summary cards fields structure)
  const statsCards = useMemo(() => {
    if (!stats) return [];

    const totalEc = stats.total_ec || 0;

    return [
      {
        id: "total_ec",
        label: "Total Evacuation Centres",
        value: totalEc.toLocaleString(),
        icon: Tent,
      },
      {
        id: "capacity",
        label: "Total Capacity",
        value: (stats.total_internal_capacity || 0).toLocaleString(),
        icon: Users,
      },
      {
        id: "toilets",
        label: "Total Toilets",
        value: (stats.total_toilets || 0).toLocaleString(),
        icon: Droplet,
      },
      {
        id: "water_storage",
        label: "Total Water Storage",
        value: `${(stats.total_water_storage || 0).toLocaleString()} L`,
        icon: Droplet,
      },
      {
        id: "showers",
        label: "Total Showers",
        value: (stats.total_showers || 0).toLocaleString(),
        icon: Droplet,
      },
      {
        id: "govt_approved",
        label: "Govt Approved Status",
        value: (stats.is_govt_approved || 0).toLocaleString(),
        icon: Shield,
      },
      {
        id: "first_aid_kit",
        label: "First Aid Kit Available",
        value: (stats.first_aid_kit_available || 0).toLocaleString(),
        icon: Heart,
      },
      {
        id: "first_aid_trained",
        label: "First Aid Trained Person",
        value: (stats.first_aid_trained_person || 0).toLocaleString(),
        icon: Activity,
      },
    ];
  }, [stats]);

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

  // Readiness indicators - All unified to bg-blue-900
  const readinessList = useMemo(() => {
    if (!stats?.readiness_indicators) return [];
    const r = stats.readiness_indicators;
    return [
      {
        name: "Owner approved",
        value: r.is_ec_owner_approved,
        color: "bg-blue-900",
      },
      {
        name: "First aid trained",
        value: r.first_aid_trained_person,
        color: "bg-blue-900",
      },
      {
        name: "Govt approved",
        value: r.is_ec_govt_approved,
        color: "bg-blue-900",
      },
      {
        name: "First aid kit",
        value: r.first_aid_kit_availability,
        color: "bg-blue-900",
      },
      {
        name: "Kitchen",
        value: r.kitchen_cooking_facilities,
        color: "bg-blue-900",
      },
      { name: "Laundry", value: r.laundry_facilities, color: "bg-blue-900" },
    ];
  }, [stats]);

  // WASH and Facility indicators list - All unified to bg-blue-900
  const washFacilityList = useMemo(() => {
    if (!stats?.wash_and_facility_indicators) return [];
    const w = stats.wash_and_facility_indicators;
    return [
      {
        name: "Water storage sites",
        value: w.water_storage_sites,
        color: "bg-blue-900",
      },
      { name: "Mens toilets", value: w.mens_toilet, color: "bg-blue-900" },
      { name: "Womens toilets", value: w.female_toilet, color: "bg-blue-900" },
      {
        name: "Unisex toilets",
        value: w.total_unisex_toilet,
        color: "bg-blue-900",
      },
      {
        name: "Mens showers",
        value: w.total_mens_shower,
        color: "bg-blue-900",
      },
      {
        name: "Kitchen available sites",
        value: w.kitchen_available_sites,
        color: "bg-blue-900",
      },
      {
        name: "Womens showers",
        value: w.total_womens_shower,
        color: "bg-blue-900",
      },
      {
        name: "Laundry available sites",
        value: w.laundry_available_sites,
        color: "bg-blue-900",
      },
      {
        name: "Disability toilets",
        value: w.total_disability_toilet,
        color: "bg-blue-900",
      },
      {
        name: "Unisex showers",
        value: w.total_unisex_shower,
        color: "bg-blue-900",
      },
    ];
  }, [stats]);

  const maxWashFacilityVal = useMemo(() => {
    if (washFacilityList.length === 0) return 1;
    return Math.max(...washFacilityList.map((i) => i.value), 1);
  }, [washFacilityList]);

  const showStatsLoading = statsLoading || locationsLoading;

  return (
    <div className="space-y-6 w-full animate-fadeIn">
      {/* 8 Stats Cards Grid (Uses the exact styles of Summary key figures grid) */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3.5">
        {showStatsLoading
          ? Array.from({ length: 8 }).map((_, idx) => (
              <div
                key={idx}
                className="p-4 rounded-lg border border-border bg-card text-card-foreground flex items-start gap-3.5 animate-pulse h-[72px]"
              />
            ))
          : statsCards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.id}
                  className="p-4 rounded-lg border flex items-start gap-3.5 bg-card text-card-foreground border-primary/40 bg-primary/5 transition-all duration-300 hover:border-primary/60"
                >
                  <div className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0 transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold tracking-tight text-foreground leading-none">
                      {card.value}
                    </h3>
                    <p className="text-[11px] font-bold text-muted-foreground mt-1 leading-tight">
                      {card.label}
                    </p>
                  </div>
                </div>
              );
            })}
      </div>

      {/* Main visualization grid - Left: Map, Right: Provinces & Readiness */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Interactive Map */}
        <div className="lg:col-span-2 space-y-6">
          {/* Map Card */}
          <div className="bg-card text-card-foreground rounded-xl border border-border p-5 flex flex-col justify-between shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
              <div>
                <h3 className="text-sm font-bold text-foreground">
                  EC location map by approval status
                </h3>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Dot size = recorded internal capacity
                </p>
              </div>

              {/* Province Selector Dropdown */}
              <div className="flex items-center space-x-2 shrink-0">
                {selectedProvince && (
                  <button
                    onClick={() => setSelectedProvince(null)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] font-bold bg-muted hover:bg-muted-foreground/10 text-muted-foreground hover:text-foreground rounded-lg transition-colors cursor-pointer"
                    title="Clear Filter"
                  >
                    <X className="h-3 w-3" />
                    <span>Clear Filter</span>
                  </button>
                )}
                <select
                  id="province-filter"
                  value={selectedProvince || ""}
                  onChange={(e) => setSelectedProvince(e.target.value || null)}
                  className="text-xs font-bold bg-muted hover:bg-muted/80 border border-border rounded-lg px-3 py-1.5 text-foreground cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20"
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

            {/* Map container — no overflow-hidden so tiles don't get clipped */}
            <div
              className="mt-4 relative w-full rounded-lg border border-border z-0"
              style={{ height: "420px" }}
            >
              {(!mapLoaded || locationsLoading) && (
                <div className="absolute inset-0 flex items-center justify-center bg-card/65 backdrop-blur-[2px] rounded-lg z-[1000] transition-all duration-300">
                  <div className="flex flex-col items-center space-y-2 bg-popover/95 px-5 py-3.5 rounded-xl border border-border shadow-md">
                    <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs font-semibold text-muted-foreground">
                      {!mapLoaded ? "Loading map..." : "Updating locations..."}
                    </span>
                  </div>
                </div>
              )}
              <div
                ref={mapRef}
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "0.5rem",
                }}
              />
            </div>

            {/* Map Legend */}
            <div className="mt-4 flex flex-wrap gap-4.5 pt-3.5 border-t border-border">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider w-full">
                Approval Status
              </span>
              <div className="flex items-center space-x-2">
                <span className="h-3 w-3 rounded-full bg-[#10b981] border border-white shadow-xs" />
                <span className="text-xs font-medium text-foreground">
                  Government approved
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="h-3 w-3 rounded-full bg-[#ef4444] border border-white shadow-xs" />
                <span className="text-xs font-medium text-foreground">
                  Not approved / unknown
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="h-3 w-3 rounded-full bg-[#3b82f6] border border-white shadow-xs" />
                <span className="text-xs font-medium text-foreground">
                  Owner approved only
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Provinces & Readiness */}
        <div className="space-y-6">
          {/* ECs by province card - Clickable filters */}
          <div className="bg-card text-card-foreground rounded-xl border border-border p-5 shadow-xs">
            <h3 className="text-sm font-bold text-foreground mb-4">
              ECs by province
            </h3>
            <div className="space-y-3.5">
              {provinceBreakdown.map((prov) => {
                const percentage = Math.round(
                  (prov.value / maxProvinceVal) * 100,
                );
                const isSelected =
                  selectedProvince?.toLowerCase() === prov.name.toLowerCase();
                return (
                  <button
                    key={prov.name}
                    onClick={() =>
                      setSelectedProvince(isSelected ? null : prov.name)
                    }
                    className="w-full text-left block focus:outline-none group cursor-pointer"
                  >
                    <div className="flex justify-between text-xs font-semibold text-foreground mb-1">
                      <span
                        className={`group-hover:text-primary transition-colors flex items-center gap-1.5 ${isSelected ? "text-primary font-bold" : ""}`}
                      >
                        {prov.name}
                        {isSelected && (
                          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                        )}
                      </span>
                      <span className="text-primary font-bold">
                        {prov.value}
                      </span>
                    </div>
                    <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ${isSelected ? "bg-primary" : "bg-blue-900 group-hover:bg-blue-800"}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Readiness Indicators Card */}
          <div className="bg-card text-card-foreground rounded-xl border border-border p-5 shadow-xs">
            <h3 className="text-sm font-bold text-foreground mb-4">
              Readiness indicators
            </h3>
            {showStatsLoading ? (
              <div className="space-y-4 py-2 animate-pulse w-full">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="h-3 bg-muted rounded w-1/2" />
                    <div className="h-2 bg-muted rounded w-full" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3.5">
                {readinessList.map((indicator) => (
                  <div key={indicator.name}>
                    <div className="flex justify-between text-xs font-semibold text-foreground mb-1">
                      <span>{indicator.name}</span>
                      <span className="text-primary font-bold">
                        {indicator.value}%
                      </span>
                    </div>
                    <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full ${indicator.color} rounded-full transition-all duration-1000`}
                        style={{ width: `${indicator.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* WASH and facility indicators (Full width below) */}
      <div className="bg-card text-card-foreground rounded-xl border border-border p-5 shadow-xs">
        <h3 className="text-sm font-bold text-foreground mb-4">
          WASH and facility indicators
        </h3>
        {showStatsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 animate-pulse">
            {Array.from({ length: 10 }).map((_, idx) => (
              <div key={idx} className="space-y-2">
                <div className="h-3 bg-muted rounded w-1/2" />
                <div className="h-2 bg-muted rounded w-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-8 gap-y-4">
            {washFacilityList.map((item) => {
              const percentage = Math.round(
                (item.value / maxWashFacilityVal) * 100,
              );
              return (
                <div key={item.name}>
                  <div className="flex justify-between text-xs font-semibold text-foreground mb-1">
                    <span>{item.name}</span>
                    <span className="text-primary font-bold">
                      {item.value}
                    </span>
                  </div>
                  <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full transition-all duration-1000`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
