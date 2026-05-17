"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

interface MermaidDiagramProps {
  chart: string;
  caption?: string;
}

let idCounter = 0;

// Static config that never changes — initialize once at module level
mermaid.initialize({
  startOnLoad: false,
  theme: "default",
  securityLevel: "loose",
  fontFamily: "inherit",
});

export function MermaidDiagram({ chart, caption }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [id] = useState(() => `mermaid-${++idCounter}`);
  const [error, setError] = useState<string | null>(null);

  const renderDiagram = useCallback((currentId: string, currentChart: string) => {
    const theme =
      document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "default";

    // Only update the theme — avoids re-running full initialization on every render
    mermaid.initialize({ theme });

    mermaid
      .render(currentId, currentChart.trim())
      .then(({ svg }) => {
        if (containerRef.current) {
          containerRef.current.innerHTML = svg;
          const svgEl = containerRef.current.querySelector("svg");
          if (svgEl) {
            svgEl.removeAttribute("width");
            svgEl.removeAttribute("height");
            svgEl.style.maxWidth = "100%";
          }
        }
      })
      .catch((err) => {
        setError(String(err));
      });
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    renderDiagram(id, chart);

    const observer = new MutationObserver(() => {
      renderDiagram(id, chart);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, [chart, id, renderDiagram]);

  if (error) {
    return (
      <div style={{ color: "red", fontFamily: "monospace", fontSize: "0.85em", padding: "1rem" }}>
        Mermaid error: {error}
      </div>
    );
  }

  return (
    <figure style={{ margin: "2rem 0", textAlign: "center" }}>
      <div
        ref={containerRef}
        style={{ display: "flex", justifyContent: "center", overflowX: "auto" }}
      />
      {caption && (
        <figcaption
          style={{
            marginTop: "0.5rem",
            fontSize: "0.85em",
            opacity: 0.6,
            fontStyle: "italic",
          }}
        >
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
