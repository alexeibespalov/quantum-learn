"use client";

import { use } from "react";
import Link from "next/link";
import { SUBJECTS } from "@/types";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  Lock,
  Play,
  Pause,
  CheckCircle,
  Video,
  FileQuestion,
  Dumbbell,
} from "lucide-react";

interface PageProps {
  params: Promise<{ subjectId: string }>;
}

// Mock module data
const moduleData = [
  {
    id: "mod-1",
    title: "Module 1: Foundations",
    status: "completed",
    lessons: [
      { id: "l1", title: "Introduction", type: "video", duration: "12 min", status: "completed" },
      { id: "l2", title: "Core Concepts", type: "video", duration: "10 min", status: "completed" },
      { id: "l3", title: "Practice Problems", type: "practice", duration: "15 min", status: "completed" },
      { id: "l4", title: "Module Quiz", type: "quiz", duration: "5 min", status: "completed" },
    ],
  },
  {
    id: "mod-2",
    title: "Module 2: Building Skills",
    status: "in-progress",
    lessons: [
      { id: "l5", title: "Advanced Techniques", type: "video", duration: "15 min", status: "completed" },
      { id: "l6", title: "Worked Examples", type: "video", duration: "12 min", status: "in-progress" },
      { id: "l7", title: "Practice Set", type: "practice", duration: "20 min", status: "locked" },
      { id: "l8", title: "Module Quiz", type: "quiz", duration: "10 min", status: "locked" },
    ],
  },
  {
    id: "mod-3",
    title: "Module 3: Mastery",
    status: "locked",
    lessons: [
      { id: "l9", title: "Complex Problems", type: "video", duration: "18 min", status: "locked" },
      { id: "l10", title: "Challenge Problems", type: "practice", duration: "25 min", status: "locked" },
      { id: "l11", title: "Final Assessment", type: "quiz", duration: "15 min", status: "locked" },
    ],
  },
];

const lessonTypeIcons = {
  video: Video,
  practice: Dumbbell,
  quiz: FileQuestion,
};

const statusIcons = {
  completed: CheckCircle,
  "in-progress": Play,
  locked: Lock,
};

export default function SubjectDetailPage({ params }: PageProps) {
  const { subjectId } = use(params);
  const subject = SUBJECTS.find((s) => s.id === subjectId);

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

  const overallProgress = 42; // Mock progress

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
            <span className="text-3xl">📚</span>
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{subject.name}</h1>
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
              className="h-full bg-primary-500 rounded-full"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Modules */}
      <div className="space-y-4">
        {moduleData.map((module, moduleIndex) => {
          const isLocked = module.status === "locked";
          const StatusIcon = statusIcons[module.status as keyof typeof statusIcons] || Lock;

          return (
            <div
              key={module.id}
              className={cn(
                "bg-white rounded-xl shadow-sm overflow-hidden",
                isLocked && "opacity-60"
              )}
            >
              {/* Module Header */}
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center",
                      module.status === "completed"
                        ? "bg-green-100 text-green-600"
                        : module.status === "in-progress"
                        ? "bg-primary-100 text-primary-600"
                        : "bg-gray-100 text-gray-400"
                    )}
                  >
                    <StatusIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{module.title}</h3>
                    <p className="text-sm text-gray-500">
                      {module.lessons.length} lessons
                    </p>
                  </div>
                </div>
              </div>

              {/* Lessons */}
              <div className="divide-y divide-gray-50">
                {module.lessons.map((lesson) => {
                  const TypeIcon = lessonTypeIcons[lesson.type as keyof typeof lessonTypeIcons] || Video;
                  const LessonStatusIcon =
                    statusIcons[lesson.status as keyof typeof statusIcons] || Lock;

                  return (
                    <div
                      key={lesson.id}
                      className={cn(
                        "p-4 flex items-center gap-4",
                        lesson.status === "locked" && "opacity-50"
                      )}
                    >
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                        <TypeIcon className="w-4 h-4 text-gray-600" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          {lesson.title}
                        </p>
                        <p className="text-sm text-gray-500">{lesson.duration}</p>
                      </div>

                      <div
                        className={cn(
                          "w-6 h-6 rounded-full flex items-center justify-center",
                          lesson.status === "completed"
                            ? "text-green-500"
                            : lesson.status === "in-progress"
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
            </div>
          );
        })}
      </div>

      {/* Continue Button */}
      <div className="mt-6">
        <Button className="w-full" size="lg">
          Continue Next Lesson
        </Button>
      </div>
    </div>
  );
}
