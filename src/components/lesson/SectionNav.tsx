"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import type { TextSection } from "@/types/course";

interface SectionNavProps {
  sections: TextSection[];
  activeSectionId: string | null;
  onSectionChange: (sectionId: string) => void;
}

export function SectionNav({
  sections,
  activeSectionId,
  onSectionChange,
}: SectionNavProps) {
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set(prev).add(entry.target.id));
          } else {
            setVisibleSections((prev) => {
              const next = new Set(prev);
              next.delete(entry.target.id);
              return next;
            });
          }
        });
      },
      { threshold: 0.5 }
    );

    sections.forEach((section) => {
      const element = document.getElementById(`section-${section.id}`);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      sections.forEach((section) => {
        const element = document.getElementById(`section-${section.id}`);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, [sections]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        const currentIndex = sections.findIndex((s) => s.id === activeSectionId);
        let nextIndex: number;

        if (e.key === "ArrowDown") {
          nextIndex = Math.min(currentIndex + 1, sections.length - 1);
        } else {
          nextIndex = Math.max(currentIndex - 1, 0);
        }

        if (nextIndex !== currentIndex) {
          onSectionChange(sections[nextIndex].id);
          const element = document.getElementById(`section-${sections[nextIndex].id}`);
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [sections, activeSectionId, onSectionChange]);

  return (
    <nav className="sticky top-4">
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="font-semibold text-gray-900 mb-4">Sections</h3>
        <div className="space-y-2">
          {sections.map((section, index) => {
            const isActive = activeSectionId === section.id;
            const isVisible = visibleSections.has(`section-${section.id}`);

            return (
              <button
                key={section.id}
                onClick={() => {
                  onSectionChange(section.id);
                  const element = document.getElementById(`section-${section.id}`);
                  if (element && element.scrollIntoView) {
                    element.scrollIntoView({ behavior: "smooth", block: "center" });
                  }
                }}
                className={cn(
                  "w-full text-left p-2 rounded-lg transition-colors flex items-center gap-2",
                  isActive
                    ? "bg-primary-50 text-primary-700 font-medium"
                    : "text-gray-600 hover:bg-gray-50"
                )}
              >
                <span
                  className={cn(
                    "w-2 h-2 rounded-full",
                    isActive || isVisible ? "bg-primary-500" : "bg-gray-300"
                  )}
                />
                <span className="flex-1">{section.title}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

