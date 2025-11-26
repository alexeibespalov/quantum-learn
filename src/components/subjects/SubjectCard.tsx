"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import type { SubjectWithProgress } from "@/services/subjects";
import { SUBJECTS } from "@/types";
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

interface SubjectCardProps {
  subject: SubjectWithProgress;
}

export function SubjectCard({ subject }: SubjectCardProps) {
  const Icon = iconMap[subject.icon] || BookOpen;
  const progress = Math.round(subject.progress);

  return (
    <Link
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
        <span className="text-sm text-gray-500">Level {subject.level}</span>
        <Button variant="ghost" size="sm">
          {progress > 0 ? "Continue" : "Start"}
        </Button>
      </div>
    </Link>
  );
}

