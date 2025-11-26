"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { getAvatarById } from "@/config/avatars";
import { Button } from "@/components/ui/Button";
import {
  Clock,
  BookOpen,
  Target,
  Flame,
  ArrowRight,
  RefreshCw,
} from "lucide-react";

export default function DashboardPage() {
  const { userProfile } = useAuth();
  const avatar = getAvatarById(userProfile?.avatarId || "avatar-1");

  // Mock data for now
  const reviewsDue = 12;
  const studyTimeThisWeek = "2h 45m";
  const lessonsCompleted = 8;
  const currentStreak = userProfile?.streakDays || 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center gap-4">
        <div
          className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl ${
            avatar?.bgColor || "bg-gray-100"
          }`}
        >
          {avatar?.emoji || "👤"}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {userProfile?.displayName || "Student"}!
          </h1>
          <p className="text-gray-600">Ready to continue your learning journey?</p>
        </div>
      </div>

      {/* Today's Mission Card */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-6 text-white">
        <h2 className="text-lg font-semibold mb-4">Your Mission Today</h2>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-sm">
              1
            </div>
            <span>Review {reviewsDue} overdue cards (10 min)</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-sm">
              2
            </div>
            <span>Complete Maths: Pythagoras Theorem (15 min)</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-sm">
              3
            </div>
            <span>Practice French vocabulary (5 min)</span>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-white/80">~30 minutes total</span>
          <Link href="/review">
            <Button variant="secondary" size="sm">
              Start Now
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Review Alert */}
      {reviewsDue > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <RefreshCw className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="font-medium text-orange-800">
                {reviewsDue} cards ready for review
              </p>
              <p className="text-sm text-orange-600">Keep your knowledge fresh!</p>
            </div>
          </div>
          <Link href="/review">
            <Button variant="outline" size="sm">
              Review Now
            </Button>
          </Link>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <Clock className="w-4 h-4" />
            <span className="text-sm">Study Time</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{studyTimeThisWeek}</p>
          <p className="text-xs text-gray-500">this week</p>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <BookOpen className="w-4 h-4" />
            <span className="text-sm">Lessons</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{lessonsCompleted}</p>
          <p className="text-xs text-gray-500">completed</p>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <Target className="w-4 h-4" />
            <span className="text-sm">XP</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {userProfile?.xp || 0}
          </p>
          <p className="text-xs text-gray-500">earned</p>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <Flame className="w-4 h-4" />
            <span className="text-sm">Streak</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{currentStreak}</p>
          <p className="text-xs text-gray-500">days</p>
        </div>
      </div>

      {/* Continue Learning */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Continue Learning
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Placeholder lesson cards */}
          {["Mathematics", "English", "Science"].map((subject) => (
            <div
              key={subject}
              className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{subject}</p>
                  <p className="text-sm text-gray-500">Module 2</p>
                </div>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-2">
                <div
                  className="h-full bg-primary-500 rounded-full"
                  style={{ width: `${Math.random() * 60 + 20}%` }}
                />
              </div>
              <Link href="/subjects">
                <Button variant="ghost" size="sm" className="w-full">
                  Continue
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
