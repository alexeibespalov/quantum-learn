"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface TranscriptSegment {
  id: string;
  startTime: number;
  endTime: number;
  text: string;
}

interface TranscriptPanelProps {
  transcript: string;
  currentTime: number;
  onSeek?: (time: number) => void;
}

// Parse transcript text into segments (simple implementation)
// In production, this would parse VTT or SRT format
function parseTranscript(transcript: string): TranscriptSegment[] {
  // Simple parsing: assume format is "timestamp - text" or just text with timestamps
  const lines = transcript.split("\n").filter((line) => line.trim());
  const segments: TranscriptSegment[] = [];

  lines.forEach((line, index) => {
    // Try to extract timestamp if present
    const timestampMatch = line.match(/(\d+):(\d+)/);
    let startTime = index * 5; // Default: 5 seconds per segment
    let text = line;

    if (timestampMatch) {
      const minutes = parseInt(timestampMatch[1]);
      const seconds = parseInt(timestampMatch[2]);
      startTime = minutes * 60 + seconds;
      text = line.replace(/^\d+:\d+\s*-?\s*/, "").trim();
    }

    segments.push({
      id: `segment-${index}`,
      startTime,
      endTime: startTime + 5, // Default 5 second segments
      text: text || line.trim(),
    });
  });

  return segments;
}

export function TranscriptPanel({
  transcript,
  currentTime,
  onSeek,
}: TranscriptPanelProps) {
  const segments = parseTranscript(transcript);
  const [activeSegmentId, setActiveSegmentId] = useState<string | null>(null);
  const activeRef = useRef<HTMLDivElement>(null);

  // Find active segment based on current time
  useEffect(() => {
    const active = segments.find(
      (segment) => currentTime >= segment.startTime && currentTime < segment.endTime
    );

    if (active) {
      setActiveSegmentId(active.id);
    }
  }, [currentTime, segments]);

  // Auto-scroll to active segment
  useEffect(() => {
    if (activeRef.current && activeRef.current.scrollIntoView) {
      activeRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [activeSegmentId]);

  const handleSegmentClick = (segment: TranscriptSegment) => {
    if (onSeek) {
      onSeek(segment.startTime);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900">Transcript</h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {segments.map((segment) => {
          const isActive = activeSegmentId === segment.id;

          return (
            <div
              key={segment.id}
              ref={isActive ? activeRef : null}
              onClick={() => handleSegmentClick(segment)}
              className={cn(
                "p-3 rounded-lg cursor-pointer transition-colors",
                isActive
                  ? "bg-primary-50 border-2 border-primary-500"
                  : "bg-gray-50 border-2 border-transparent hover:bg-gray-100"
              )}
            >
              <p className="text-sm text-gray-700">{segment.text}</p>
              <span className="text-xs text-gray-500 mt-1 block">
                {Math.floor(segment.startTime / 60)}:
                {Math.floor(segment.startTime % 60)
                  .toString()
                  .padStart(2, "0")}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

