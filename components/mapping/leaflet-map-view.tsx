"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import {
  X,
  Tent,
  Users,
  Layers,
  Search,
  ChevronDown,
  ChevronUp,
  Route,
  Plane,
  Anchor,
  Flame,
  Hospital,
  GraduationCap,
  Building2,
  Home,
  Download,
} from "lucide-react";
import { useEvacuationCentresStats, useEvacuationCentreLocations } from "@/hooks/use-dashboard";
import { LAYERS, TILE_PROVIDERS,  } from "./layers-config";

const VANUATU_BOUNDS: [[number, number], [number, number]] = [
  [-20.8, 165.5],
  [-12.6, 170.8],
];

interface LeafletMapViewProps {
  selectedProvince?: string | null;
  onProvinceChange?: (province: string | null) => void;
  selectedCoordinates?: { latitude: number; longitude: number } | null;
  onCoordinatesChange?: (coords: { latitude: number; longitude: number } | null) => void;
}

const safe = (v: any) => (v === null || v === undefined || v === "" ? "—" : String(v));

const titleOf = (p: Record<string, any> = {}) =>
  p.ec_name ||
  p.name ||
  p.title ||
  p.location_name ||
  p.compound_name ||
  p.community ||
  p.area_council ||
  p.pname ||
  p.NAME_1 ||
  p.ADM1_EN ||
  "Vanuatu Feature";

export default function LeafletMapView({
  selectedProvince = null,
  onProvinceChange,
  selectedCoordinates = null,
  onCoordinatesChange,
}: LeafletMapViewProps) {
  // 1. Live stats & backend EC data
  const { data: stats, isLoading: statsLoading } = useEvacuationCentresStats({
    province: selectedProvince || undefined,
    latitude: selectedCoordinates?.latitude,
    longitude: selectedCoordinates?.longitude,
  });

  const { data: locations, isLoading: locationsLoading } = useEvacuationCentreLocations({
    province: selectedProvince || undefined,
  });

  // 2. Interactive state
  const [enabledLayers, setEnabledLayers] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(LAYERS.map((l) => [l.id, l.defaultOn])),
  );
  const [layerData, setLayerData] = useState<Record<string, any>>({});
  const [layerErrors, setLayerErrors] = useState<Record<string, string>>({});
  const [activeTile, setActiveTile] = useState<string>("openstreetmap");
  const [layerSearch, setLayerSearch] = useState<string>("");
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});
  const [showLayerPanel, setShowLayerPanel] = useState<boolean>(true);

  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapInstanceRef = useRef<any>(null);
  const tileLayerInstanceRef = useRef<any>(null);
  const featureLayersRef = useRef<Record<string, any>>({});

  // 3. Fetch Spatial GeoJSON Data
  useEffect(() => {
    let isMounted = true;
    LAYERS.forEach(async (l) => {
      try {
        let fetchUrl = l.url;
        if (l.id === "evacuation_centres") {
          fetchUrl = "https://api.decmcluster.org/api/evacuation-centres/location/";
        }

        let r = await fetch(fetchUrl).catch(() => null);
        
        // Fallback for Evacuation Centres if remote API is unreachable or blocked by CORS
        if ((!r || !r.ok) && l.id === "evacuation_centres") {
          r = await fetch("/data/decm/evacuation_centres.geojson").catch(() => null);
        }

        if (!r || !r.ok) throw new Error(`HTTP ${r?.status || 500}`);
        let j = await r.json();

        // Normalize array from API (e.g. https://api.decmcluster.org/api/evacuation-centres/location/) into GeoJSON FeatureCollection
        if (Array.isArray(j)) {
          j = {
            type: "FeatureCollection",
            features: j.map((item: any) => ({
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [Number(item.longitude || item.lon), Number(item.latitude || item.lat)],
              },
              properties: {
                name: item.compound_name || item.name || "Evacuation Centre",
                province: item.province || "",
                approval_status: item.is_ec_govt_approved
                  ? "Approved"
                  : item.is_ec_owner_approved
                  ? "Under Review"
                  : "Pending",
                recorded_internal_capacity: item.recorded_internal_capacity || item.capacity || 250,
                ...item,
              },
            })),
          };
        }

        if (isMounted) {
          setLayerData((d) => ({ ...d, [l.id]: j }));
        }
      } catch (e: any) {
        if (isMounted) {
          setLayerErrors((x) => ({ ...x, [l.id]: e.message }));
        }
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // 4. Load Leaflet script dynamically
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

  // 5. Initialize Leaflet Map Instance
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;
    const L = (window as any).L;
    if (!L || mapInstanceRef.current) return;

    let activeMap: any = null;

    const initMap = () => {
      if (!mapRef.current) return;
      activeMap = L.map(mapRef.current, {
        zoomControl: false,
        scrollWheelZoom: true,
        preferCanvas: true,
        maxBounds: VANUATU_BOUNDS,
        maxBoundsViscosity: 1.0,
        minZoom: 6,
        maxZoom: 18,
      }).fitBounds(VANUATU_BOUNDS);

      L.control.zoom({ position: "bottomright" }).addTo(activeMap);
      L.control.scale({ position: "bottomleft", imperial: false }).addTo(activeMap);

      const provider = TILE_PROVIDERS[activeTile] || TILE_PROVIDERS.openstreetmap;
      tileLayerInstanceRef.current = L.tileLayer(provider.url, {
        maxZoom: provider.maxZoom,
        attribution: provider.attribution,
        crossOrigin: true,
      }).addTo(activeMap);

      mapInstanceRef.current = activeMap;

      requestAnimationFrame(() => {
        activeMap.invalidateSize();
        setTimeout(() => activeMap?.invalidateSize(), 300);
      });
    };

    requestAnimationFrame(initMap);

    return () => {
      if (activeMap) {
        activeMap.remove();
      }
      mapInstanceRef.current = null;
      tileLayerInstanceRef.current = null;
      featureLayersRef.current = {};
    };
  }, [mapLoaded]);

  // 6. Base Tile Layer Switcher
  useEffect(() => {
    const L = (window as any).L;
    if (!mapInstanceRef.current || !L) return;

    const provider = TILE_PROVIDERS[activeTile] || TILE_PROVIDERS.openstreetmap;

    if (tileLayerInstanceRef.current) {
      mapInstanceRef.current.removeLayer(tileLayerInstanceRef.current);
    }

    tileLayerInstanceRef.current = L.tileLayer(provider.url, {
      maxZoom: provider.maxZoom,
      attribution: provider.attribution,
      crossOrigin: true,
    }).addTo(mapInstanceRef.current);
  }, [activeTile]);

  // 7. Render Features & GeoJSON Layers on Map
  useEffect(() => {
    const L = (window as any).L;
    const map = mapInstanceRef.current;
    if (!map || !L) return;

    // Clear existing feature layers
    Object.values(featureLayersRef.current).forEach((layerObj: any) => {
      if (layerObj && map.hasLayer(layerObj)) {
        map.removeLayer(layerObj);
      }
    });
    featureLayersRef.current = {};

    // Render Enabled Layers
    LAYERS.forEach((config) => {
      if (!enabledLayers[config.id]) return;

      const data = layerData[config.id];
      if (!data || !data.features || data.features.length === 0) return;

      const layerGroup = L.featureGroup();

      data.features.forEach((feature: any, idx: number) => {
        try {
          if (!feature || !feature.geometry) return;

          const geomType = feature.geometry.type;
          const props = feature.properties || {};
          const title = titleOf(props);

          // Build popup HTML
          const rows = Object.entries(props)
            .filter(
              ([k, v]) =>
                v !== null && v !== "" && v !== undefined && k !== "osm_id" && k !== "osm_type",
            )
            .slice(0, 10);

          let coordsText = "";
          let googleMapsUrl = "";

          if (geomType === "Point") {
            const coords = feature.geometry.coordinates;
            if (!Array.isArray(coords) || coords.length < 2) return;
            const lng = Number(coords[0]);
            const lat = Number(coords[1]);
            if (isNaN(lat) || isNaN(lng)) return;

            coordsText = `${lat.toFixed(4)}°, ${lng.toFixed(4)}°`;
            googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
          }

          const popupContent = `
            <div style="font-family: var(--font-sans, system-ui, sans-serif); min-width: 220px; max-width: 280px; padding: 2px;">
              <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 6px; padding-bottom: 6px; border-bottom: 1px solid #e2e8f0;">
                <span style="font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: ${config.color || config.style?.color || "#2563eb"}; background: rgba(37, 99, 235, 0.08); padding: 2px 6px; border-radius: 4px;">
                  ${config.name}
                </span>
                ${coordsText ? `<span style="font-size: 10px; color: #64748b; font-weight: 600;">${coordsText}</span>` : ""}
              </div>
              <h4 style="margin: 0 0 6px 0; font-size: 13px; font-weight: 800; color: #0f172a; line-height: 1.3;">
                ${title}
              </h4>
              <table style="width: 100%; border-collapse: collapse; font-size: 11px; margin-bottom: 8px;">
                <tbody>
                  ${rows
                    .map(
                      ([k, v]) => `
                    <tr>
                      <td style="padding: 2px 4px; color: #64748b; font-weight: 600; text-transform: capitalize; border-top: 1px solid #f1f5f9; width: 45%;">${String(k).replaceAll("_", " ")}</td>
                      <td style="padding: 2px 4px; color: #1e293b; font-weight: 700; border-top: 1px solid #f1f5f9;">${safe(v)}</td>
                    </tr>
                  `,
                    )
                    .join("")}
                </tbody>
              </table>
              ${
                googleMapsUrl
                  ? `<a href="${googleMapsUrl}" target="_blank" rel="noopener noreferrer"
                       style="display: flex; align-items: center; justify-content: center; gap: 6px; width: 100%; background: #2563eb; color: #ffffff; padding: 6px 10px; border-radius: 6px; text-decoration: none; font-weight: 700; font-size: 11px; text-align: center; box-sizing: border-box; transition: background 0.2s;">
                       <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
                       View on Google Maps
                     </a>`
                  : ""
              }
            </div>
          `;

          if (geomType === "Point") {
            const coords = feature.geometry.coordinates;
            if (!Array.isArray(coords) || coords.length < 2) return;
            const lng = Number(coords[0]);
            const lat = Number(coords[1]);
            if (isNaN(lat) || isNaN(lng)) return;

            let markerColor = config.color || config.style?.color || "#2563eb";
            let radius = config.group === "DECM Operational" ? 7 : config.group === "Hazards" ? 8 : 5;

            // Special dynamic sizing & approval status color for Evacuation Centres
            if (config.id === "evacuation_centres") {
              const status = (props.approval_status || props.status || "").toLowerCase();
              if (status.includes("approved")) {
                markerColor = "#10b981"; // Emerald
              } else if (status.includes("review") || status.includes("pending")) {
                markerColor = "#f59e0b"; // Amber
              } else if (status.includes("draft")) {
                markerColor = "#0284c7"; // Sky Blue
              } else if (status.includes("closed") || status.includes("deferred")) {
                markerColor = "#ef4444"; // Red
              }

              const cap = Number(props.recorded_internal_capacity || props.capacity_hhs || props.capacity || 100);
              radius = Math.min(Math.max(Math.sqrt(cap) * 0.5, 6), 24);
            }

            const marker = L.circleMarker([lat, lng], {
              radius,
              fillColor: markerColor,
              color: "#ffffff",
              weight: 2,
              opacity: 1,
              fillOpacity: 0.85,
            });

            marker.bindPopup(popupContent);
            marker.on("click", () => {
              if (onCoordinatesChange) {
                onCoordinatesChange({ latitude: lat, longitude: lng });
              }
            });
            layerGroup.addLayer(marker);
          } else {
            const isRoad = config.id === "roads" || config.type === "line";
            const style = isRoad
              ? {
                  color: config.color || "#dc2626",
                  weight: 3.5,
                  opacity: 0.9,
                  fill: false,
                  fillOpacity: 0,
                }
              : config.style || {
                  color: config.color || "#2563eb",
                  weight: 2,
                  fillOpacity: 0.1,
                };

            const geoJsonLayer = L.geoJSON(feature, {
              style: () => style,
              onEachFeature: (_: any, layer: any) => {
                layer.bindPopup(popupContent);
              },
            });
            layerGroup.addLayer(geoJsonLayer);
          }
        } catch (err) {
          // Ignore individual malformed features gracefully
        }
      });

      layerGroup.addTo(map);
      featureLayersRef.current[config.id] = layerGroup;
    });

    // Handle province filter map panning
    if (selectedCoordinates) {
      map.setView([selectedCoordinates.latitude, selectedCoordinates.longitude], 12);
    } else if (selectedProvince) {
      const provinceCoords: Record<string, [number, number]> = {
        Shefa: [-17.74, 168.32],
        Sanma: [-15.51, 167.18],
        Tafea: [-19.53, 169.27],
        Malampa: [-16.1, 167.42],
        Penama: [-15.28, 167.98],
        Torba: [-13.85, 167.55],
      };
      if (provinceCoords[selectedProvince]) {
        map.setView(provinceCoords[selectedProvince], 9);
      }
    }

    requestAnimationFrame(() => map.invalidateSize());
  }, [enabledLayers, layerData, selectedProvince, selectedCoordinates]);

  // Layer Grouping & Filtering Logic
  const groups = useMemo(() => [...new Set(LAYERS.map((l) => l.group))], []);

  const totalLoadedFeatures = useMemo(() => {
    return LAYERS.filter((l) => enabledLayers[l.id]).reduce(
      (n, l) => n + (layerData[l.id]?.features?.length || 0),
      0,
    );
  }, [enabledLayers, layerData]);

  // Icon mapping helper
  const renderLayerIcon = (id: string, group: string) => {
    switch (id) {
      case "roads":
        return <Route className="w-3.5 h-3.5 text-red-500" />;
      case "airports":
        return <Plane className="w-3.5 h-3.5 text-blue-500" />;
      case "ports":
        return <Anchor className="w-3.5 h-3.5 text-sky-500" />;
      case "health":
        return <Hospital className="w-3.5 h-3.5 text-rose-500" />;
      case "schools":
        return <GraduationCap className="w-3.5 h-3.5 text-amber-500" />;
      case "volcanoes":
        return <Flame className="w-3.5 h-3.5 text-red-700" />;
      case "settlements":
        return <Home className="w-3.5 h-3.5 text-gray-500" />;
      case "evacuation_centres":
        return <Tent className="w-3.5 h-3.5 text-emerald-500" />;
      case "displacement":
        return <Users className="w-3.5 h-3.5 text-orange-500" />;
      default:
        return <Building2 className="w-3.5 h-3.5 text-primary" />;
    }
  };

  const toggleAllInGroup = (groupName: string, enable: boolean) => {
    const groupLayerIds = LAYERS.filter((l) => l.group === groupName).map((l) => l.id);
    setEnabledLayers((prev) => {
      const next = { ...prev };
      groupLayerIds.forEach((id) => {
        next[id] = enable;
      });
      return next;
    });
  };

  const toggleGroupCollapse = (groupName: string) => {
    setCollapsedGroups((prev) => ({ ...prev, [groupName]: !prev[groupName] }));
  };

  const showLoading = statsLoading || locationsLoading;

  const activeLayerNames = LAYERS.filter((l) => enabledLayers[l.id]).map((l) => l.name);
  const activeMapTitle =
    activeLayerNames.length > 0
      ? `Vanuatu ${activeLayerNames.join(" & ")} Map`
      : "Vanuatu Spatial GIS Map";

  return (
    <div className="space-y-6">
      {/* Printable Map CSS for 1-Page PDF Download */}
      <style jsx global>{`
        @page {
          size: A4 landscape;
          margin: 0;
        }
        @media print {
          html, body {
            height: 100% !important;
            max-height: 100vh !important;
            overflow: hidden !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          body * {
            visibility: hidden !important;
          }
          #printable-vanuatu-map-canvas,
          #printable-vanuatu-map-canvas * {
            visibility: visible !important;
          }
          #printable-vanuatu-map-canvas {
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            max-height: 100vh !important;
            margin: 0 !important;
            padding: 12px 16px !important;
            background: #ffffff !important;
            box-sizing: border-box !important;
            overflow: hidden !important;
            page-break-after: avoid !important;
            page-break-inside: avoid !important;
            break-after: avoid !important;
            break-inside: avoid !important;
          }
          #printable-vanuatu-map-canvas .map-frame {
            height: calc(100vh - 50px) !important;
            max-height: calc(100vh - 50px) !important;
            margin-top: 0px !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* Main GIS Spatial Map Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left GIS Spatial Layer Filter Panel (Order 2 on mobile, Order 1 on desktop) */}
        <div className="order-2 lg:order-1 no-print lg:col-span-4 xl:col-span-3 bg-card text-card-foreground rounded-xl border border-border p-4 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-extrabold text-foreground">Spatial Map Layers</h3>
            </div>
            <span className="px-2 py-0.5 text-[10px] font-bold bg-primary/10 text-primary rounded-full">
              {totalLoadedFeatures.toLocaleString()} Features
            </span>
          </div>

          {/* Layer Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search layers (roads, airports, health)..."
              value={layerSearch}
              onChange={(e) => setLayerSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-muted border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            {layerSearch && (
              <button
                onClick={() => setLayerSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Accordion Layer Groups */}
          <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
            {groups.map((groupName) => {
              const matchingLayers = LAYERS.filter(
                (l) =>
                  l.group === groupName && l.name.toLowerCase().includes(layerSearch.toLowerCase()),
              );
              if (matchingLayers.length === 0) return null;

              const isCollapsed = !!collapsedGroups[groupName];
              const allEnabled = matchingLayers.every((l) => enabledLayers[l.id]);

              return (
                <div
                  key={groupName}
                  className="rounded-lg border border-border/80 bg-background/50 overflow-hidden"
                >
                  <div className="w-full px-3 py-2 bg-muted/40 hover:bg-muted/80 transition-colors flex items-center justify-between">
                    <button
                      onClick={() => toggleGroupCollapse(groupName)}
                      className="flex items-center gap-2 text-left cursor-pointer flex-1"
                    >
                      {isCollapsed ? (
                        <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                      ) : (
                        <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" />
                      )}
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">
                        {groupName}
                      </span>
                    </button>
                    <button
                      onClick={() => toggleAllInGroup(groupName, !allEnabled)}
                      className="text-[10px] font-bold text-primary hover:underline cursor-pointer"
                    >
                      {allEnabled ? "Hide All" : "Show All"}
                    </button>
                  </div>

                  {!isCollapsed && (
                    <div className="p-2 space-y-1 divide-y divide-border/30">
                      {matchingLayers.map((l) => {
                        const isChecked = !!enabledLayers[l.id];
                        const count = layerData[l.id]?.features?.length;
                        const error = layerErrors[l.id];

                        return (
                          <label
                            key={l.id}
                            className={`flex items-center justify-between p-1.5 rounded-md hover:bg-muted/50 transition-colors cursor-pointer text-xs ${
                              isChecked ? "font-bold text-foreground" : "text-muted-foreground"
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() =>
                                  setEnabledLayers((prev) => ({ ...prev, [l.id]: !prev[l.id] }))
                                }
                                className="w-3.5 h-3.5 rounded border-border text-primary focus:ring-primary/20 accent-primary cursor-pointer"
                              />
                              {renderLayerIcon(l.id, l.group)}
                              <span className="truncate">{l.name}</span>
                            </div>
                            <span
                              className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono shrink-0 ${
                                count !== undefined
                                  ? "bg-muted text-muted-foreground"
                                  : error
                                    ? "bg-red-500/10 text-red-500"
                                    : "bg-primary/10 text-primary animate-pulse"
                              }`}
                            >
                              {count !== undefined ? count : error ? "!" : "..."}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>


          <div className="p-3 bg-muted/30 border border-border/60 rounded-lg text-[11px] text-muted-foreground space-y-1">
            <span className="font-bold text-foreground block">Data Governance</span>
            <p className="line-clamp-3">
              Spatial layers harmonized from OpenStreetMap, HDX (HumData), Vanuatu NDMO/VMGD, and SPC Pacific Data Hub.
            </p>
          </div>
        </div>

        {/* Right Map Canvas Section (Order 1 on mobile, Order 2 on desktop) */}
        <div
          id="printable-vanuatu-map-canvas"
          className="order-1 lg:order-2 lg:col-span-8 xl:col-span-9 bg-card text-card-foreground rounded-xl border border-border p-4 shadow-xs flex flex-col justify-between"
        >
          {/* Map Header Controls (Hidden during PDF print download) */}
          <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-foreground">Interactive Spatial Map</h3>
                <span className="px-2 py-0.5 text-[10px] font-extrabold bg-blue-500/10 text-blue-600 rounded-md uppercase">
                  OpenStreetMap
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 font-medium">
                Vanuatu EPSG:4326 GIS Coordinates & Spatial Layers
              </p>
            </div>

            {/* Filter controls & province selector */}
            <div className="no-print flex items-center space-x-2 shrink-0">
              {(selectedProvince || selectedCoordinates) && (
                <button
                  onClick={() => {
                    if (onProvinceChange) onProvinceChange(null);
                    if (onCoordinatesChange) onCoordinatesChange(null);
                  }}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold bg-muted hover:bg-muted-foreground/10 text-muted-foreground hover:text-foreground rounded-lg transition-colors cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                  <span>Clear Filter</span>
                </button>
              )}
              <button
                onClick={() => {
                  if (typeof window !== "undefined") {
                    window.print();
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg transition-colors cursor-pointer shadow-xs"
                title="Download or Print PDF Map of Vanuatu"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download Map PDF</span>
              </button>

              <select
                value={selectedProvince || ""}
                onChange={(e) => {
                  if (onProvinceChange) onProvinceChange(e.target.value || null);
                  if (onCoordinatesChange) onCoordinatesChange(null);
                }}
                className="text-xs font-bold bg-muted border border-border rounded-lg px-3 py-1.5 text-foreground cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">All Vanuatu Provinces</option>
                <option value="Shefa">Shefa Province (Port Vila)</option>
                <option value="Sanma">Sanma Province (Luganville)</option>
                <option value="Tafea">Tafea Province (Tanna)</option>
                <option value="Malampa">Malampa Province (Malekula)</option>
                <option value="Penama">Penama Province (Ambae)</option>
                <option value="Torba">Torba Province (Banks)</option>
              </select>
            </div>
          </div>

          {/* Leaflet Map Canvas Container */}
          <div
            className="map-frame mt-4 relative w-full rounded-xl border border-border z-0 overflow-hidden"
            style={{ height: "600px" }}
          >
            {(!mapLoaded || showLoading) && (
              <div className="absolute inset-0 flex items-center justify-center bg-card/75 backdrop-blur-[2px] rounded-xl z-[1000]">
                <div className="flex flex-col items-center space-y-2 bg-popover px-5 py-3.5 rounded-xl border border-border shadow-md">
                  <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs font-semibold text-muted-foreground">
                    {!mapLoaded
                      ? "Initializing OpenStreetMap Engine..."
                      : "Updating Spatial Layers..."}
                  </span>
                </div>
              </div>
            )}
            <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
          </div>

          {/* Feature Legend Bar */}
          <div className="mt-4 pt-3.5 border-t border-border flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                Map Legend:
              </span>
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-red-600 border border-white shadow-xs" />
                <span className="font-semibold text-foreground">Roads & Highways</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-blue-600 border border-white shadow-xs" />
                <span className="font-semibold text-foreground">Airports</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-emerald-500 border border-white shadow-xs" />
                <span className="font-semibold text-foreground">Evacuation Shelters</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-rose-600 border border-white shadow-xs" />
                <span className="font-semibold text-foreground">Health Facilities</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-red-900 border border-white shadow-xs" />
                <span className="font-semibold text-foreground">Volcanoes</span>
              </div>
            </div>
            <div className="text-[11px] text-muted-foreground font-medium">
              Click any spatial feature or road to inspect attributes & Google Maps links
            </div>
          </div>

          {/* Map Sources & Vanuatu Disclaimer Footer */}
          <div className="mt-3 pt-2.5 border-t border-border/60 text-[11px] text-muted-foreground/80 space-y-0.5">
            <p className="font-semibold text-muted-foreground">
              Map Sources: OpenStreetMap, HDX (HumData), Vanuatu NDMO / DECM Cluster, SPC Pacific Data Hub.
            </p>
            <p className="italic text-[10.5px]">
              The boundaries and names shown and the designations used on this map do not imply official endorsement or acceptance by the Government of Vanuatu or the DECM Cluster.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
