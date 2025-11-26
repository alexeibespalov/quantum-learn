"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  Lock,
  Play,
  CheckCircle,
  Video,
  FileQuestion,
  Dumbbell,
  MessageSquare,
} from "lucide-react";
import type { SubjectDetails } from "@/services/subjects";

interface ModuleAccordionProps {
  modules: SubjectDetails["modules"];
}

const lessonTypeIcons = {
  video: Video,
  text: FileQuestion,
  simulation: Dumbbell,
  chat: MessageSquare,
};

const statusIcons = {
  completed: CheckCircle,
  in_progress: Play,
  locked: Lock,
  available: Play,
  not_started: Lock,
};

export function ModuleAccordion({ modules }: ModuleAccordionProps) {
  const [expandedModules, setExpandedModules] = useState<Set<string>>(
    new Set()
  );

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      if (next.has(moduleId)) {
        next.delete(moduleId);
      } else {
        next.add(moduleId);
      }
      return next;
    });
  };

  return (
    <div className="space-y-4">
      {modules.map((module) => {
        const isExpanded = expandedModules.has(module.id);
        const isLocked = module.status === "locked";
        const StatusIcon = statusIcons[module.status] || Lock;

        return (
          <div
            key={module.id}
            className={cn(
              "bg-white rounded-xl shadow-sm overflow-hidden",
              isLocked && "opacity-60"
            )}
          >
            {/* Module Header */}
            <div
              className="p-4 border-b border-gray-100 flex items-center justify-between cursor-pointer"
              onClick={() => !isLocked && toggleModule(module.id)}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center",
                    module.status === "completed"
                      ? "bg-green-100 text-green-600"
                      : module.status === "in_progress"
                      ? "bg-primary-100 text-primary-600"
                      : "bg-gray-100 text-gray-400"
                  )}
                >
                  <StatusIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {module.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {module.lessons.length} lessons
                  </p>
                </div>
              </div>
              {!isLocked && (
                <ChevronDown
                  className={cn(
                    "w-5 h-5 text-gray-400 transition-transform",
                    isExpanded && "transform rotate-180"
                  )}
                />
              )}
            </div>

            {/* Lessons List */}
            {isExpanded && (
              <div className="divide-y divide-gray-50">
                {module.lessons.map((lesson) => {
                  const TypeIcon =
                    lessonTypeIcons[lesson.type] || Video;
                  const LessonStatusIcon =
                    statusIcons[lesson.status] || Lock;

                  return (
                    <div
                      key={lesson.id}
                      className={cn(
                        "p-4 flex items-center gap-4",
                        lesson.status === "not_started" && "opacity-50"
                      )}
                    >
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                        <TypeIcon className="w-4 h-4 text-gray-600" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          {lesson.title}
                        </p>
                        <p className="text-sm text-gray-500">
                          {lesson.duration} min
                        </p>
                      </div>

                      <div
                        className={cn(
                          "w-6 h-6 rounded-full flex items-center justify-center",
                          lesson.status === "completed"
                            ? "text-green-500"
                            : lesson.status === "in_progress"
                            ? "text-primary-500"
                            : "text-gray-300"
                        )}
                      >
                        <LessonStatusIcon className="w-4 h-4" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

