"use client";

import { useState } from "react";
import type { Hotspot } from "@/types/course";
import { cn } from "@/lib/utils";

interface InteractiveDiagramProps {
  imageUrl: string;
  caption?: string;
  hotspots?: Hotspot[];
  className?: string;
}

export function InteractiveDiagram({
  imageUrl,
  caption,
  hotspots = [],
  className = "",
}: InteractiveDiagramProps) {
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);

  return (
    <div className={cn("relative", className)}>
      <div className="relative w-full">
        <img
          src={imageUrl}
          alt={caption || "Diagram"}
          className="w-full h-auto rounded-lg shadow-lg"
        />

        {/* Hotspots */}
        {hotspots.map((hotspot) => (
          <button
            key={hotspot.id}
            onClick={() =>
              setActiveHotspot(activeHotspot === hotspot.id ? null : hotspot.id)
            }
            className="absolute rounded-full bg-primary-500 w-6 h-6 border-2 border-white shadow-lg hover:bg-primary-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
            style={{
              left: `${hotspot.x}%`,
              top: `${hotspot.y}%`,
              transform: "translate(-50%, -50%)",
            }}
            aria-label={hotspot.title}
          >
            <span className="sr-only">{hotspot.title}</span>
          </button>
        ))}

        {/* Hotspot Tooltip */}
        {activeHotspot && (
          <div
            className="absolute bg-white rounded-lg shadow-xl p-4 border border-gray-200 z-10 max-w-xs"
            style={{
              left: `${hotspots.find((h) => h.id === activeHotspot)?.x || 0}%`,
              top: `${(hotspots.find((h) => h.id === activeHotspot)?.y || 0) + 5}%`,
              transform: "translateX(-50%)",
            }}
          >
            <h4 className="font-semibold text-gray-900 mb-1">
              {hotspots.find((h) => h.id === activeHotspot)?.title}
            </h4>
            <p className="text-sm text-gray-600">
              {hotspots.find((h) => h.id === activeHotspot)?.description}
            </p>
          </div>
        )}
      </div>

      {caption && (
        <p className="text-sm text-gray-600 mt-2 text-center italic">{caption}</p>
      )}
    </div>
  );
}

