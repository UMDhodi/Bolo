import { useEffect, useMemo } from "react";
import { MapContainer, Marker, Polygon, Polyline, TileLayer, Tooltip, useMap } from "react-leaflet";
import L from "leaflet";

import { INDIA_RINGS, WORLD_RING } from "@/lib/india-boundary";
import { INDIA_CENTER, formatDate, type Issue } from "@/lib/mock-data";

// Locked viewport: India only.
const INDIA_BOUNDS = L.latLngBounds([6.4, 67.5], [36.5, 97.6]);

function markerIcon(issue: Issue, selected: boolean) {
  const color = `var(--status-${issue.status})`;
  return L.divIcon({
    className: "bolo-marker",
    html: `<span style="background:${color}"></span>`,
    iconSize: selected ? [26, 26] : [18, 18],
    iconAnchor: selected ? [13, 13] : [9, 9],
  });
}

/** Whole of India is always visible in the panel; pan/zoom stay inside it. */
function BoundsLock() {
  const map = useMap();
  useEffect(() => {
    // "inside=false" = contain: the entire country stays visible in the panel.
    const baseZoom = () => map.getBoundsZoom(INDIA_BOUNDS, false);

    const clamp = () => {
      const z = baseZoom();
      if (map.getMinZoom() !== z) map.setMinZoom(z);
      if (map.getZoom() < z) map.setZoom(z, { animate: false });
      map.panInsideBounds(INDIA_BOUNDS, { animate: false });
    };

    const fit = () => {
      map.setMinZoom(0);
      map.setView(INDIA_BOUNDS.getCenter(), baseZoom(), { animate: false });
      clamp();
    };

    map.setMaxBounds(INDIA_BOUNDS);
    fit();

    map.on("resize", fit);
    map.on("moveend zoomend", clamp);
    return () => {
      map.off("resize", fit);
      map.off("moveend zoomend", clamp);
    };
  }, [map]);
  return null;
}

/**
 * Everything outside India is masked out, and India's outline (including
 * Jammu & Kashmir and Ladakh) is drawn on top, so only the Indian map shows.
 */
function IndiaOnlyOverlay() {
  return (
    <>
      <Polygon
        positions={[WORLD_RING, ...INDIA_RINGS]}
        pathOptions={{
          stroke: false,
          fillColor: "#eef1f4",
          fillOpacity: 1,
          fillRule: "evenodd",
          interactive: false,
        }}
      />
      {INDIA_RINGS.map((ring, i) => (
        <Polyline
          key={i}
          positions={ring}
          pathOptions={{
            color: "hsl(24 40% 45%)",
            weight: 1.1,
            opacity: 0.75,
            interactive: false,
          }}
        />
      ))}
    </>
  );
}

function ViewController({
  center,
  zoom,
  focus,
}: {
  center: [number, number];
  zoom: number;
  focus?: [number, number][] | undefined;
}) {
  const map = useMap();
  const focusKey = (focus ?? []).map((p) => p.join(",")).join("|");

  useEffect(() => {
    // Search / filter results: fit them snugly inside the panel.
    if (focus && focus.length > 0) {
      const bounds = L.latLngBounds(focus.map((p) => L.latLng(p)));
      const single = focus[0];
      if (focus.length === 1 && single) {
        map.flyTo(single, Math.max(10, map.getMinZoom()), { duration: 0.9 });
      } else {
        map.flyToBounds(bounds.pad(0.35), {
          duration: 0.9,
          maxZoom: 12,
          padding: [24, 24],
        });
      }
      return;
    }

    const isCountryView = center[0] === INDIA_CENTER[0] && center[1] === INDIA_CENTER[1];
    if (isCountryView) {
      map.setView(INDIA_BOUNDS.getCenter(), map.getBoundsZoom(INDIA_BOUNDS, false), {
        animate: true,
      });
      return;
    }
    const target = INDIA_BOUNDS.contains(L.latLng(center)) ? center : INDIA_CENTER;
    map.flyTo(target, Math.max(zoom, map.getMinZoom()), { duration: 0.9 });
  }, [map, center[0], center[1], zoom, focusKey]);
  return null;
}

export default function IssueMap({
  issues,
  selectedId,
  onSelect,
  center = INDIA_CENTER,
  zoom = 4.5,
  focus,
}: {
  issues: Issue[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  center?: [number, number];
  zoom?: number;
  focus?: [number, number][] | undefined;
}) {
  const markers = useMemo(
    () =>
      issues.map((issue) => ({
        issue,
        icon: markerIcon(issue, issue.id === selectedId),
      })),
    [issues, selectedId],
  );

  return (
    <MapContainer
      bounds={INDIA_BOUNDS}
      maxZoom={17}
      zoomSnap={0}
      zoomDelta={0.5}
      scrollWheelZoom
      maxBounds={INDIA_BOUNDS}
      maxBoundsViscosity={1}
      worldCopyJump={false}
      className="size-full"
      style={{ minHeight: "100%" }}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        subdomains={["a", "b", "c", "d"]}
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &middot; &copy; <a href="https://carto.com/attributions">CARTO</a>'
        bounds={INDIA_BOUNDS}
        noWrap
        maxZoom={19}
      />
      <IndiaOnlyOverlay />
      <BoundsLock />
      <ViewController center={center} zoom={zoom} focus={focus} />

      {markers.map(({ issue, icon }) => (
        <Marker
          key={issue.id}
          position={[issue.lat, issue.lng]}
          icon={icon}
          zIndexOffset={issue.id === selectedId ? 1000 : 0}
          eventHandlers={{ click: () => onSelect(issue.id) }}
        >
          <Tooltip direction="top" offset={[0, -10]} opacity={1}>
            <span className="font-semibold">{issue.title}</span>
            <br />
            <span>
              {issue.location} · {formatDate(issue.date)}
            </span>
          </Tooltip>
        </Marker>
      ))}
    </MapContainer>
  );
}
