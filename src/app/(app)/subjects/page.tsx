"use client";

import { useState } from "react";
import Link from "next/link";
import { SUBJECTS } from "@/types";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import {
  Calculator,
  BookOpen,
  Leaf,
  FlaskConical,
  Atom,
  Languages,
  Landmark,
  Globe,
  Code,
  Church,
  Palette,
  Dumbbell,
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  calculator: Calculator,
  "book-open": BookOpen,
  leaf: Leaf,
  "flask-conical": FlaskConical,
  atom: Atom,
  languages: Languages,
  landmark: Landmark,
  globe: Globe,
  code: Code,
  church: Church,
  palette: Palette,
  dumbbell: Dumbbell,
};

type FilterType = "all" | "in-progress" | "not-started";

export default function SubjectsPage() {
  const [filter, setFilter] = useState<FilterType>("all");

  // Mock progress data
  const progressData: Record<string, { progress: number; level: number }> = {
    mathematics: { progress: 42, level: 3 },
    english: { progress: 35, level: 2 },
    biology: { progress: 60, level: 4 },
    chemistry: { progress: 25, level: 2 },
    physics: { progress: 15, level: 1 },
    french: { progress: 50, level: 3 },
    history: { progress: 0, level: 1 },
    geography: { progress: 0, level: 1 },
    computing: { progress: 70, level: 5 },
    "religious-studies": { progress: 0, level: 1 },
    art: { progress: 10, level: 1 },
    pe: { progress: 0, level: 1 },
  };

  const filteredSubjects = SUBJECTS.filter((subject) => {
    const progress = progressData[subject.id]?.progress || 0;
    if (filter === "in-progress") return progress > 0 && progress < 100;
    if (filter === "not-started") return progress === 0;
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Subjects</h1>
        <p className="text-gray-600">Explore your Year 9 curriculum</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { value: "all" as const, label: "All" },
          { value: "in-progress" as const, label: "In Progress" },
          { value: "not-started" as const, label: "Not Started" },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
              filter === tab.value
                ? "bg-primary-100 text-primary-700"
                : "text-gray-600 hover:bg-gray-100"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Subjects Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredSubjects.map((subject) => {
          const Icon = iconMap[subject.icon] || BookOpen;
          const progress = progressData[subject.id]?.progress || 0;
          const level = progressData[subject.id]?.level || 1;

          return (
            <Link
              key={subject.id}
              href={`/subjects/${subject.id}`}
              className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                  <Icon className="w-6 h-6 text-primary-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {subject.name}
                  </h3>
                  <p className="text-sm text-gray-500">Year 9 • Key Stage 3</p>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium text-gray-900">{progress}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all",
                      progress >= 90
                        ? "bg-yellow-500"
                        : progress >= 70
                        ? "bg-green-500"
                        : progress >= 30
                        ? "bg-primary-500"
                        : "bg-gray-300"
                    )}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-gray-500">Level {level}</span>
                <Button variant="ghost" size="sm">
                  {progress > 0 ? "Continue" : "Start"}
                </Button>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
