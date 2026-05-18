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

// Oxford Properties — RAC complex, Toronto Financial District
const RAC_BUILDINGS = [
  { title: "Scotia Plaza", address: "40 King St W, Toronto", lat: 43.6489, lng: -79.3813 },
  { title: "Exchange Tower", address: "130 King St W, Toronto", lat: 43.6488, lng: -79.3831 },
  { title: "145 King West", address: "145 King St W, Toronto", lat: 43.6484, lng: -79.384 },
  { title: "100 Adelaide West", address: "100 Adelaide St W, Toronto", lat: 43.65, lng: -79.3811 },
  { title: "Simcoe Place", address: "200 Front St W, Toronto", lat: 43.6456, lng: -79.3873 },
];

const MAP_CENTER = { lat: 43.6483, lng: -79.3834 };
const INITIAL_ZOOM = 14;

function clusterSvg(count: number) {
  return [
    `<svg width="50" height="50" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">`,
    `<circle cx="12" cy="12" r="12" fill="#1a73e8" fill-opacity="0.25"/>`,
    `<circle cx="12" cy="12" r="10" fill="#1a73e8"/>`,
    `<circle cx="12" cy="12" r="8" fill="white"/>`,
    `<text x="12" y="16" fill="#1a73e8" font-size="10" font-family="Arial" font-weight="bold" text-anchor="middle">${count}</text>`,
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
      // Script already injected — wait for the callback
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

        for (const building of RAC_BUILDINGS) {
          const marker = new window.google.maps.Marker({
            position: { lat: building.lat, lng: building.lng },
            map,
            title: building.title,
          });

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
            render({ count, position }) {
              return new window.google.maps.Marker({
                position,
                icon: {
                  url: `data:image/svg+xml;base64,${window.btoa(clusterSvg(count))}`,
                  scaledSize: new window.google.maps.Size(50, 50),
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
        Oxford Properties RAC complex — zoom out to see all 5 properties cluster into one
        marker, zoom in to reveal individual building pins.
      </figcaption>
    </figure>
  );
}
