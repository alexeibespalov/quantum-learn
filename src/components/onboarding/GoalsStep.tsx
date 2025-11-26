"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { SUBJECTS } from "@/types";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import {
  Clock,
  Bell,
  Type,
  Sun,
  Check,
} from "lucide-react";

interface GoalsStepProps {
  onComplete: (data: {
    dailyGoalMinutes: 15 | 30 | 45 | 60;
    prioritySubjects: string[];
    notifications: {
      dailyReminder: boolean;
      reminderTime?: string;
      reviewAlerts: boolean;
    };
    accessibility: {
      fontSize: "small" | "medium" | "large";
      highContrast: boolean;
    };
  }) => void;
  loading?: boolean;
}

const goalOptions = [
  { value: 15 as const, label: "15 min", description: "Light" },
  { value: 30 as const, label: "30 min", description: "Balanced" },
  { value: 45 as const, label: "45 min", description: "Focused" },
  { value: 60 as const, label: "60 min", description: "Intensive" },
];

const fontSizeOptions = [
  { value: "small" as const, label: "A", size: "text-sm" },
  { value: "medium" as const, label: "A", size: "text-base" },
  { value: "large" as const, label: "A", size: "text-lg" },
];

export function GoalsStep({ onComplete, loading }: GoalsStepProps) {
  const [dailyGoal, setDailyGoal] = useState<15 | 30 | 45 | 60>(30);
  const [prioritySubjects, setPrioritySubjects] = useState<string[]>([
    "mathematics",
    "english",
    "biology",
    "chemistry",
    "physics",
    "french",
  ]);
  const [dailyReminder, setDailyReminder] = useState(true);
  const [reminderTime, setReminderTime] = useState("16:00");
  const [reviewAlerts, setReviewAlerts] = useState(true);
  const [fontSize, setFontSize] = useState<"small" | "medium" | "large">("medium");
  const [highContrast, setHighContrast] = useState(false);

  const toggleSubject = (subjectId: string) => {
    setPrioritySubjects((prev) =>
      prev.includes(subjectId)
        ? prev.filter((id) => id !== subjectId)
        : [...prev, subjectId]
    );
  };

  const handleSubmit = () => {
    if (prioritySubjects.length < 3) {
      alert("Please select at least 3 subjects");
      return;
    }

    onComplete({
      dailyGoalMinutes: dailyGoal,
      prioritySubjects,
      notifications: {
        dailyReminder,
        reminderTime: dailyReminder ? reminderTime : undefined,
        reviewAlerts,
      },
      accessibility: {
        fontSize,
        highContrast,
      },
    });
  };

  return (
    <div className="max-w-2xl mx-auto px-4 pb-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Set Your Goals
        </h1>
        <p className="text-gray-600">
          Customize your learning experience
        </p>
      </div>

      <div className="space-y-8">
        {/* Daily Study Goal */}
        <section className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-primary-600" />
            <h2 className="text-lg font-semibold">Daily Study Goal</h2>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {goalOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setDailyGoal(option.value)}
                className={cn(
                  "p-4 rounded-lg border-2 text-center transition-all",
                  dailyGoal === option.value
                    ? "border-primary-500 bg-primary-50"
                    : "border-gray-200 hover:border-gray-300"
                )}
              >
                <span className="block font-semibold text-gray-900">
                  {option.label}
                </span>
                <span className="text-sm text-gray-500">{option.description}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Subject Priorities */}
        <section className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-2">Focus Subjects</h2>
          <p className="text-sm text-gray-500 mb-4">
            Select subjects to include in your daily missions (min 3)
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {SUBJECTS.map((subject) => (
              <button
                key={subject.id}
                onClick={() => toggleSubject(subject.id)}
                className={cn(
                  "p-3 rounded-lg border-2 text-sm text-left transition-all flex items-center gap-2",
                  prioritySubjects.includes(subject.id)
                    ? "border-primary-500 bg-primary-50"
                    : "border-gray-200 hover:border-gray-300"
                )}
              >
                {prioritySubjects.includes(subject.id) && (
                  <Check className="w-4 h-4 text-primary-600 flex-shrink-0" />
                )}
                <span className="truncate">{subject.name}</span>
              </button>
            ))}
          </div>
          {prioritySubjects.length < 3 && (
            <p className="text-sm text-red-500 mt-2">
              Please select at least 3 subjects
            </p>
          )}
        </section>

        {/* Notifications */}
        <section className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-5 h-5 text-primary-600" />
            <h2 className="text-lg font-semibold">Notifications</h2>
          </div>
          <div className="space-y-4">
            <label className="flex items-center justify-between">
              <span className="text-gray-700">Daily reminder</span>
              <div className="flex items-center gap-3">
                {dailyReminder && (
                  <input
                    type="time"
                    value={reminderTime}
                    onChange={(e) => setReminderTime(e.target.value)}
                    className="px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                )}
                <button
                  onClick={() => setDailyReminder(!dailyReminder)}
                  className={cn(
                    "w-12 h-6 rounded-full transition-colors relative",
                    dailyReminder ? "bg-primary-600" : "bg-gray-300"
                  )}
                >
                  <motion.div
                    className="w-5 h-5 bg-white rounded-full absolute top-0.5"
                    animate={{ left: dailyReminder ? "26px" : "2px" }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>
            </label>

            <label className="flex items-center justify-between">
              <span className="text-gray-700">Review alerts</span>
              <button
                onClick={() => setReviewAlerts(!reviewAlerts)}
                className={cn(
                  "w-12 h-6 rounded-full transition-colors relative",
                  reviewAlerts ? "bg-primary-600" : "bg-gray-300"
                )}
              >
                <motion.div
                  className="w-5 h-5 bg-white rounded-full absolute top-0.5"
                  animate={{ left: reviewAlerts ? "26px" : "2px" }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </button>
            </label>
          </div>
        </section>

        {/* Accessibility */}
        <section className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Accessibility</h2>
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Type className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700">Font size</span>
              </div>
              <div className="flex gap-2">
                {fontSizeOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setFontSize(option.value)}
                    className={cn(
                      "w-12 h-12 rounded-lg border-2 flex items-center justify-center transition-all",
                      option.size,
                      fontSize === option.value
                        ? "border-primary-500 bg-primary-50"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <label className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sun className="w-4 h-4 text-gray-500" />
                <span className="text-gray-700">High contrast mode</span>
              </div>
              <button
                onClick={() => setHighContrast(!highContrast)}
                className={cn(
                  "w-12 h-6 rounded-full transition-colors relative",
                  highContrast ? "bg-primary-600" : "bg-gray-300"
                )}
              >
                <motion.div
                  className="w-5 h-5 bg-white rounded-full absolute top-0.5"
                  animate={{ left: highContrast ? "26px" : "2px" }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </button>
            </label>
          </div>
        </section>

        <Button
          onClick={handleSubmit}
          className="w-full"
          size="lg"
          loading={loading}
          disabled={prioritySubjects.length < 3}
        >
          Start Learning
        </Button>
      </div>
    </div>
  );
}
