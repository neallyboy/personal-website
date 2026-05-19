"use client";

import { GridAlgorithm, MarkerClusterer } from "@googlemaps/markerclusterer";
import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    initGoogleMapsDemo?: () => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    google: any;
  }
}

type Building = {
  title: string;
  address: string;
  lat: number;
  lng: number;
  city: string;
  province: string;
};

// Oxford Properties — RAC complex, Toronto Financial District
const RAC_BUILDINGS: Building[] = [
  { title: "Scotia Plaza",       address: "40 King St W, Toronto",    lat: 43.6489, lng: -79.3813, city: "Toronto", province: "ON" },
  { title: "Exchange Tower",     address: "130 King St W, Toronto",   lat: 43.6488, lng: -79.3831, city: "Toronto", province: "ON" },
  { title: "145 King West",      address: "145 King St W, Toronto",   lat: 43.6484, lng: -79.384,  city: "Toronto", province: "ON" },
  { title: "100 Adelaide West",  address: "100 Adelaide St W, Toronto", lat: 43.65, lng: -79.3811, city: "Toronto", province: "ON" },
  { title: "Simcoe Place",       address: "200 Front St W, Toronto",  lat: 43.6456, lng: -79.3873, city: "Toronto", province: "ON" },
];

// Oxford Properties — ROYAL complex, Vaughan Industrial Park
const ROYAL_BUILDINGS: Building[] = [
  { title: "71 Royal Group Crescent",  address: "71 Royal Group Crescent, Vaughan",  lat: 43.7658, lng: -79.6251, city: "Vaughan", province: "ON" },
  { title: "91 Royal Group Crescent",  address: "91 Royal Group Crescent, Vaughan",  lat: 43.7665, lng: -79.626,  city: "Vaughan", province: "ON" },
  { title: "100 Royal Group Crescent", address: "100 Royal Group Crescent, Vaughan", lat: 43.7672, lng: -79.627,  city: "Vaughan", province: "ON" },
  { title: "101 Royal Group Crescent", address: "101 Royal Group Crescent, Vaughan", lat: 43.7679, lng: -79.628,  city: "Vaughan", province: "ON" },
  { title: "111 Royal Group Crescent", address: "111 Royal Group Crescent, Vaughan", lat: 43.7692, lng: -79.6291, city: "Vaughan", province: "ON" },
];

// Oxford Properties — CITYVIEW complex, Edmonton South Industrial District
const CITYVIEW_BUILDINGS: Building[] = [
  { title: "Cityview Business Park — Building 1",  address: "Cityview Business Park, Edmonton", lat: 53.5002, lng: -113.422,  city: "Edmonton", province: "AB" },
  { title: "Cityview Business Park — Building 2",  address: "Cityview Business Park, Edmonton", lat: 53.4998, lng: -113.4212, city: "Edmonton", province: "AB" },
  { title: "Cityview Business Park — Building 3",  address: "Cityview Business Park, Edmonton", lat: 53.4994, lng: -113.4204, city: "Edmonton", province: "AB" },
  { title: "Cityview Business Park — Building 4",  address: "Cityview Business Park, Edmonton", lat: 53.499,  lng: -113.4196, city: "Edmonton", province: "AB" },
  { title: "Cityview Business Park — Building 5",  address: "Cityview Business Park, Edmonton", lat: 53.4986, lng: -113.4188, city: "Edmonton", province: "AB" },
  { title: "Cityview Business Park — Building 6",  address: "Cityview Business Park, Edmonton", lat: 53.4982, lng: -113.418,  city: "Edmonton", province: "AB" },
  { title: "Cityview Business Park — Building 7",  address: "Cityview Business Park, Edmonton", lat: 53.4978, lng: -113.4172, city: "Edmonton", province: "AB" },
  { title: "Cityview Business Park — Building 8",  address: "Cityview Business Park, Edmonton", lat: 53.4974, lng: -113.4164, city: "Edmonton", province: "AB" },
  { title: "Cityview Business Park — Building 9",  address: "Cityview Business Park, Edmonton", lat: 53.497,  lng: -113.4156, city: "Edmonton", province: "AB" },
  { title: "Cityview Business Park — Building 10", address: "Cityview Business Park, Edmonton", lat: 53.4966, lng: -113.4148, city: "Edmonton", province: "AB" },
  { title: "Cityview Business Park — Building 11", address: "Cityview Business Park, Edmonton", lat: 53.4996, lng: -113.4148, city: "Edmonton", province: "AB" },
  { title: "Cityview Business Park — Building 12", address: "Cityview Business Park, Edmonton", lat: 53.4988, lng: -113.4156, city: "Edmonton", province: "AB" },
  { title: "Cityview Business Park — Building 14", address: "Cityview Business Park, Edmonton", lat: 53.498,  lng: -113.4164, city: "Edmonton", province: "AB" },
  { title: "Cityview — Retail",                    address: "Cityview Business Park, Edmonton", lat: 53.4972, lng: -113.4172, city: "Edmonton", province: "AB" },
];

// Oxford Properties — James Snow Business Park, Milton
const JAMES_SNOW_BUILDINGS: Building[] = [
  { title: "10725 Louis St. Laurent Avenue", address: "10725 Louis St. Laurent Ave, Milton", lat: 43.5057, lng: -79.8385, city: "Milton", province: "ON" },
  { title: "6440 Fifth Line",                address: "6440 Fifth Line, Milton",             lat: 43.5246, lng: -79.8146, city: "Milton", province: "ON" },
  { title: "905 James Snow Parkway S",       address: "905 James Snow Pkwy S, Milton",       lat: 43.5343, lng: -79.8486, city: "Milton", province: "ON" },
  { title: "955 James Snow Parkway S",       address: "955 James Snow Pkwy S, Milton",       lat: 43.5328, lng: -79.8379, city: "Milton", province: "ON" },
];

// Oxford Properties — MetroCentre complex, Toronto Financial District
const METROCTR_BUILDINGS: Building[] = [
  { title: "MetroCentre — King Tower",       address: "225 King St W, Toronto", lat: 43.6468, lng: -79.3882, city: "Toronto", province: "ON" },
  { title: "MetroCentre — Wellington Tower", address: "225 King St W, Toronto", lat: 43.6467, lng: -79.388,  city: "Toronto", province: "ON" },
  { title: "MetroCentre — Retail",           address: "225 King St W, Toronto", lat: 43.6466, lng: -79.3884, city: "Toronto", province: "ON" },
];

// Oxford Properties — Centennial Place, Calgary Eau Claire
const CENTENNIAL_BUILDINGS: Building[] = [
  { title: "Centennial Place — East Tower", address: "Centennial Place, Calgary", lat: 51.0508, lng: -114.0722, city: "Calgary", province: "AB" },
  { title: "Centennial Place — West Tower", address: "Centennial Place, Calgary", lat: 51.0507, lng: -114.0729, city: "Calgary", province: "AB" },
];

// Oxford Properties — Brampton Business Park
const BRAMPTON_BUILDINGS: Building[] = [
  { title: "9050 Airport Road",  address: "9050 Airport Rd, Brampton", lat: 43.7474, lng: -79.7014, city: "Brampton", province: "ON" },
  { title: "9150 Airport Road",  address: "9150 Airport Rd, Brampton", lat: 43.7501, lng: -79.705,  city: "Brampton", province: "ON" },
  { title: "9200 Airport Road",  address: "9200 Airport Rd, Brampton", lat: 43.7515, lng: -79.7068, city: "Brampton", province: "ON" },
  { title: "9250 Airport Road",  address: "9250 Airport Rd, Brampton", lat: 43.7484, lng: -79.7041, city: "Brampton", province: "ON" },
  { title: "255 Chrysler Drive", address: "255 Chrysler Dr, Brampton", lat: 43.7459, lng: -79.7105, city: "Brampton", province: "ON" },
];

// Oxford Properties — Canada Square, Toronto (Yonge & Eglinton)
const CANADASQ_BUILDINGS: Building[] = [
  { title: "2200 Yonge Street", address: "2200 Yonge St, Toronto", lat: 43.7058, lng: -79.3985, city: "Toronto", province: "ON" },
  { title: "2190 Yonge Street", address: "2190 Yonge St, Toronto", lat: 43.7052, lng: -79.3984, city: "Toronto", province: "ON" },
  { title: "2180 Yonge Street", address: "2180 Yonge St, Toronto", lat: 43.7046, lng: -79.3983, city: "Toronto", province: "ON" },
];

// Oxford Properties — Oxford Airport Business Park, Calgary NE
const AIRPORTTRL_BUILDINGS: Building[] = [
  { title: "OABP Building B", address: "Oxford Airport Business Park, Calgary", lat: 51.14,   lng: -114.0245, city: "Calgary", province: "AB" },
  { title: "OABP Building D", address: "Oxford Airport Business Park, Calgary", lat: 51.1396, lng: -114.0238, city: "Calgary", province: "AB" },
  { title: "OABP Building E", address: "Oxford Airport Business Park, Calgary", lat: 51.1392, lng: -114.0231, city: "Calgary", province: "AB" },
  { title: "OABP Building F", address: "Oxford Airport Business Park, Calgary", lat: 51.1404, lng: -114.0231, city: "Calgary", province: "AB" },
  { title: "OABP Building G", address: "Oxford Airport Business Park, Calgary", lat: 51.1388, lng: -114.0245, city: "Calgary", province: "AB" },
  { title: "OABP Building H", address: "Oxford Airport Business Park, Calgary", lat: 51.1408, lng: -114.0238, city: "Calgary", province: "AB" },
  { title: "OABP Building I", address: "Oxford Airport Business Park, Calgary", lat: 51.1384, lng: -114.0224, city: "Calgary", province: "AB" },
  { title: "OABP Building L", address: "Oxford Airport Business Park, Calgary", lat: 51.1412, lng: -114.0252, city: "Calgary", province: "AB" },
];

// Oxford Properties — Queensborough Logistics Park, New Westminster BC
const BOYD501_BUILDINGS: Building[] = [
  { title: "Queensborough Logistics Park — Damco Building", address: "Queensborough Logistics Park, New Westminster", lat: 49.1862, lng: -122.9462, city: "New Westminster", province: "BC" },
  { title: "Queensborough Logistics Park — Building 2",     address: "Queensborough Logistics Park, New Westminster", lat: 49.1858, lng: -122.9456, city: "New Westminster", province: "BC" },
  { title: "Queensborough Logistics Park — Building 3",     address: "Queensborough Logistics Park, New Westminster", lat: 49.1854, lng: -122.945,  city: "New Westminster", province: "BC" },
];

// Oxford Properties — Riverbend Business Park, Burnaby BC
const WIGGINS_BUILDINGS: Building[] = [
  { title: "Riverbend Business Park — Building 1", address: "Riverbend Business Park, Burnaby", lat: 49.1855, lng: -122.9742, city: "Burnaby", province: "BC" },
  { title: "Riverbend Business Park — Building 2", address: "Riverbend Business Park, Burnaby", lat: 49.1852, lng: -122.9736, city: "Burnaby", province: "BC" },
  { title: "Riverbend Business Park — Building 3", address: "Riverbend Business Park, Burnaby", lat: 49.1849, lng: -122.973,  city: "Burnaby", province: "BC" },
  { title: "Riverbend Business Park — Building 4", address: "Riverbend Business Park, Burnaby", lat: 49.1858, lng: -122.973,  city: "Burnaby", province: "BC" },
  { title: "Riverbend Business Park — Building 5", address: "Riverbend Business Park, Burnaby", lat: 49.1846, lng: -122.9742, city: "Burnaby", province: "BC" },
  { title: "Riverbend Business Park — Building 6", address: "Riverbend Business Park, Burnaby", lat: 49.1862, lng: -122.9748, city: "Burnaby", province: "BC" },
];

// Oxford Properties — WaterPark Place, Toronto Waterfront
const WATERPRK_BUILDINGS: Building[] = [
  { title: "WaterPark Place — 20 Bay Street",      address: "20 Bay St, Toronto",        lat: 43.6416, lng: -79.3779, city: "Toronto", province: "ON" },
  { title: "WaterPark Place — 10 Bay Street",      address: "10 Bay St, Toronto",        lat: 43.6412, lng: -79.3776, city: "Toronto", province: "ON" },
  { title: "RBC WaterPark Place — 88 Queens Quay", address: "88 Queens Quay W, Toronto", lat: 43.6409, lng: -79.3782, city: "Toronto", province: "ON" },
];

const ALL_BUILDINGS: Building[] = [
  ...RAC_BUILDINGS,
  ...ROYAL_BUILDINGS,
  ...CITYVIEW_BUILDINGS,
  ...JAMES_SNOW_BUILDINGS,
  ...METROCTR_BUILDINGS,
  ...CENTENNIAL_BUILDINGS,
  ...BRAMPTON_BUILDINGS,
  ...CANADASQ_BUILDINGS,
  ...AIRPORTTRL_BUILDINGS,
  ...BOYD501_BUILDINGS,
  ...WIGGINS_BUILDINGS,
  ...WATERPRK_BUILDINGS,
];

// Centered to show Ontario, Alberta, and BC clusters
const MAP_CENTER = { lat: 50.0, lng: -100.0 };
const INITIAL_ZOOM = 4;

// Derive a short context label from the markers in a cluster.
// Single city → city name. Multiple cities, one province → province abbreviation.
// Multiple provinces → no label (count alone is enough context).
function clusterLabel(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  markers: any[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  markerMeta: Map<any, { city: string; province: string }>,
): string {
  const cities = new Set<string>();
  const provinces = new Set<string>();
  for (const m of markers) {
    const meta = markerMeta.get(m);
    if (meta) {
      cities.add(meta.city);
      provinces.add(meta.province);
    }
  }
  if (cities.size === 1) return [...cities][0];
  if (provinces.size === 1) return [...provinces][0];
  return "";
}

function clusterSvg(count: number, label: string): string {
  const hasLabel = label.length > 0;
  const totalH = hasLabel ? 68 : 50;
  // Truncate long city names to fit the pill
  const displayLabel = label.length > 13 ? `${label.slice(0, 12)}…` : label;

  const pill = hasLabel
    ? [
        `<rect x="1" y="52" width="48" height="15" rx="7.5" fill="#1a73e8"/>`,
        `<text x="25" y="63" fill="white" font-size="9" font-family="Arial" font-weight="bold" text-anchor="middle">${displayLabel}</text>`,
      ].join("")
    : "";

  return [
    `<svg width="50" height="${totalH}" viewBox="0 0 50 ${totalH}" xmlns="http://www.w3.org/2000/svg">`,
    `<circle cx="25" cy="25" r="25" fill="#1a73e8" fill-opacity="0.25"/>`,
    `<circle cx="25" cy="25" r="20" fill="#1a73e8"/>`,
    `<circle cx="25" cy="25" r="16" fill="white"/>`,
    `<text x="25" y="30" fill="#1a73e8" font-size="13" font-family="Arial" font-weight="bold" text-anchor="middle">${count}</text>`,
    pill,
    `</svg>`,
  ].join("");
}

function loadMapsScript(apiKey: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.google?.maps) {
      resolve();
      return;
    }
    if (document.querySelector('script[src*="maps.googleapis.com"]')) {
      window.initGoogleMapsDemo = resolve;
      return;
    }
    window.initGoogleMapsDemo = resolve;
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initGoogleMapsDemo`;
    script.async = true;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

export function GoogleMapsClusterDemo() {
  const mapDivRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "missing-key" | "error">("loading");
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    if (!apiKey) {
      setStatus("missing-key");
      return;
    }

    let cancelled = false;

    loadMapsScript(apiKey)
      .then(() => {
        if (cancelled || !mapDivRef.current) return;

        const map = new window.google.maps.Map(mapDivRef.current, {
          zoom: INITIAL_ZOOM,
          center: MAP_CENTER,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
        });

        const infoWindow = new window.google.maps.InfoWindow();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const markers: any[] = [];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const markerMeta = new Map<any, { city: string; province: string }>();

        for (const building of ALL_BUILDINGS) {
          const marker = new window.google.maps.Marker({
            position: { lat: building.lat, lng: building.lng },
            map,
            title: building.title,
          });

          markerMeta.set(marker, { city: building.city, province: building.province });

          marker.addListener("click", () => {
            infoWindow.setContent(
              `<div style="padding:4px 2px;font-family:sans-serif">` +
                `<strong style="font-size:14px">${building.title}</strong><br/>` +
                `<span style="color:#555;font-size:12px">${building.address}</span>` +
                `</div>`,
            );
            infoWindow.open({ anchor: marker, map });
          });

          markers.push(marker);
        }

        new MarkerClusterer({
          map,
          markers,
          algorithm: new GridAlgorithm({ gridSize: 60 }),
          renderer: {
            render(cluster) {
              const { count, position, markers: clusterMarkers = [] } = cluster;
              const label = clusterLabel(clusterMarkers, markerMeta);
              const hasLabel = label.length > 0;
              const iconH = hasLabel ? 68 : 50;

              return new window.google.maps.Marker({
                position,
                icon: {
                  url: `data:image/svg+xml;base64,${window.btoa(clusterSvg(count, label))}`,
                  scaledSize: new window.google.maps.Size(50, iconH),
                  // Keep the circle centred on the geo point; label extends below
                  anchor: new window.google.maps.Point(25, 25),
                },
                zIndex: 1000 + count,
              });
            },
          },
        });

        if (!cancelled) setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
      delete window.initGoogleMapsDemo;
    };
  }, [apiKey]);

  if (status === "missing-key") {
    return (
      <div
        style={{
          padding: "2rem",
          borderRadius: "8px",
          border: "1px dashed var(--neutral-alpha-medium)",
          textAlign: "center",
          color: "var(--neutral-on-background-weak)",
          fontSize: "14px",
        }}
      >
        Add{" "}
        <code style={{ background: "var(--neutral-alpha-weak)", padding: "2px 6px", borderRadius: "4px" }}>
          NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
        </code>{" "}
        to{" "}
        <code style={{ background: "var(--neutral-alpha-weak)", padding: "2px 6px", borderRadius: "4px" }}>
          .env.local
        </code>{" "}
        to display the live demo.
      </div>
    );
  }

  if (status === "error") {
    return (
      <div
        style={{
          padding: "2rem",
          borderRadius: "8px",
          border: "1px dashed var(--neutral-alpha-medium)",
          textAlign: "center",
          color: "var(--danger-on-background-weak)",
          fontSize: "14px",
        }}
      >
        Failed to load the Google Maps demo. Check the API key and CSP headers.
      </div>
    );
  }

  return (
    <figure style={{ margin: "2rem 0" }}>
      <div
        style={{
          position: "relative",
          borderRadius: "8px",
          overflow: "hidden",
          border: "1px solid var(--neutral-alpha-medium)",
        }}
      >
        {status === "loading" && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "var(--neutral-background-weak)",
              color: "var(--neutral-on-background-weak)",
              fontSize: "14px",
              zIndex: 1,
            }}
          >
            Loading map…
          </div>
        )}
        <div ref={mapDivRef} style={{ width: "100%", height: "460px" }} />
      </div>
      <figcaption
        style={{
          marginTop: "0.5rem",
          fontSize: "0.85em",
          opacity: 0.6,
          fontStyle: "italic",
          textAlign: "center",
        }}
      >
        Twelve Oxford Properties complexes across Canada — clusters in Ontario (Toronto, Vaughan,
        Brampton, Milton), Alberta (Calgary, Edmonton), and BC (Burnaby, New Westminster). Zoom in
        on any cluster to reveal individual building pins; click a pin to see its address.
      </figcaption>
    </figure>
  );
}
