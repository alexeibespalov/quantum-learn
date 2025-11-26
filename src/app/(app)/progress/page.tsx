"use client";

import { useAuth } from "@/context/AuthContext";
import { SUBJECTS } from "@/types";
import { Clock, BookOpen, Target, Flame, TrendingUp } from "lucide-react";

export default function ProgressPage() {
  const { userProfile } = useAuth();

  // Mock data
  const stats = {
    studyTime: "8h 32m",
    studyTimeChange: "+15%",
    lessonsCompleted: 24,
    questionsAnswered: 346,
    accuracy: 82,
    streak: userProfile?.streakDays || 0,
    longestStreak: 12,
  };

  // Mock subject mastery
  const subjectMastery = SUBJECTS.slice(0, 6).map((s) => ({
    ...s,
    mastery: Math.floor(Math.random() * 70) + 20,
  }));

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Your Progress</h1>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 bg-primary-100 text-primary-700 rounded-lg text-sm font-medium">
            Last 7 days
          </button>
          <button className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded-lg text-sm">
            Last 30 days
          </button>
          <button className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded-lg text-sm">
            All time
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <Clock className="w-4 h-4" />
            <span className="text-sm">Study Time</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.studyTime}</p>
          <p className="text-sm text-green-600 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            {stats.studyTimeChange} vs last week
          </p>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <BookOpen className="w-4 h-4" />
            <span className="text-sm">Lessons</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {stats.lessonsCompleted}
          </p>
          <p className="text-sm text-gray-500">completed</p>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <Target className="w-4 h-4" />
            <span className="text-sm">Questions</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {stats.questionsAnswered}
          </p>
          <p className="text-sm text-gray-500">{stats.accuracy}% correct</p>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <Flame className="w-4 h-4" />
            <span className="text-sm">Streak</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.streak} days</p>
          <p className="text-sm text-gray-500">Best: {stats.longestStreak} days</p>
        </div>
      </div>

      {/* Subject Mastery */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Subject Mastery
        </h2>
        <div className="space-y-4">
          {subjectMastery.map((subject) => (
            <div key={subject.id}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-700">{subject.name}</span>
                <span className="font-medium text-gray-900">
                  {subject.mastery}%
                </span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    subject.mastery >= 90
                      ? "bg-yellow-500"
                      : subject.mastery >= 70
                      ? "bg-green-500"
                      : subject.mastery >= 30
                      ? "bg-primary-500"
                      : "bg-red-400"
                  }`}
                  style={{ width: `${subject.mastery}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-sm text-green-600">
            You&apos;re excelling in Science and French!
          </p>
          <p className="text-sm text-orange-600">
            Mathematics needs more practice
          </p>
        </div>
      </div>

      {/* Activity Calendar Placeholder */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Consistency Calendar
        </h2>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: 84 }).map((_, i) => (
            <div
              key={i}
              className={`aspect-square rounded ${
                Math.random() > 0.3
                  ? Math.random() > 0.6
                    ? "bg-green-500"
                    : "bg-green-300"
                  : "bg-gray-100"
              }`}
            />
          ))}
        </div>
        <div className="flex items-center justify-end gap-2 mt-4 text-xs text-gray-500">
          <span>Less</span>
          <div className="w-3 h-3 bg-gray-100 rounded" />
          <div className="w-3 h-3 bg-green-200 rounded" />
          <div className="w-3 h-3 bg-green-400 rounded" />
          <div className="w-3 h-3 bg-green-600 rounded" />
          <span>More</span>
        </div>
      </div>
    </div>
  );
}
