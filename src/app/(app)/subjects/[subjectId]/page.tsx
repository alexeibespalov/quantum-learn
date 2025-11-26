"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { getSubjectDetails } from "@/services/subjects";
import { ModuleAccordion } from "@/components/subjects/ModuleAccordion";
import { Button } from "@/components/ui/Button";
import { SUBJECTS } from "@/types";
import type { SubjectDetails } from "@/services/subjects";
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
  ArrowLeft,
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

interface PageProps {
  params: Promise<{ subjectId: string }>;
}

export default function SubjectDetailPage({ params }: PageProps) {
  const { subjectId } = use(params);
  const { user } = useAuth();
  const [subjectDetails, setSubjectDetails] = useState<SubjectDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const subject = SUBJECTS.find((s) => s.id === subjectId);

  useEffect(() => {
    if (!user || !subjectId) {
      setLoading(false);
      return;
    }

    loadSubjectDetails();
  }, [user, subjectId]);

  const loadSubjectDetails = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      const details = await getSubjectDetails(subjectId as any, user.uid);
      setSubjectDetails(details);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to load subject details"));
    } finally {
      setLoading(false);
    }
  };

  if (!subject) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Subject not found</p>
        <Link href="/subjects">
          <Button className="mt-4">Back to Subjects</Button>
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Link
            href="/subjects"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            All Subjects
          </Link>
        </div>
        <div className="text-center py-12">
          <p className="text-gray-600">Loading subject details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Link
            href="/subjects"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            All Subjects
          </Link>
        </div>
        <div className="text-center py-12">
          <p className="text-red-600">Error: {error.message}</p>
        </div>
      </div>
    );
  }

  if (!subjectDetails) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Subject details not found</p>
        <Link href="/subjects">
          <Button className="mt-4">Back to Subjects</Button>
        </Link>
      </div>
    );
  }

  const Icon = iconMap[subject.icon] || BookOpen;
  const overallProgress = Math.round(subjectDetails.progress);

  // Find next incomplete lesson
  const nextLesson = subjectDetails.modules
    .flatMap((module) => module.lessons)
    .find((lesson) => lesson.status !== "completed" && lesson.status !== "not_started");

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/subjects"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          All Subjects
        </Link>

        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center">
            <Icon className="w-8 h-8 text-primary-600" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{subjectDetails.name}</h1>
            <p className="text-gray-600">Year 9 Key Stage 3</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Overall Progress</span>
            <span className="font-medium text-gray-900">{overallProgress}% Mastered</span>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${
                overallProgress >= 90
                  ? "bg-yellow-500"
                  : overallProgress >= 70
                  ? "bg-green-500"
                  : overallProgress >= 30
                  ? "bg-primary-500"
                  : "bg-gray-300"
              }`}
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Modules */}
      <ModuleAccordion modules={subjectDetails.modules} />

      {/* Continue Button */}
      {nextLesson && (
        <div className="mt-6">
          <Link href={`/lesson/${nextLesson.id}`}>
            <Button className="w-full" size="lg">
              Continue Next Lesson
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
