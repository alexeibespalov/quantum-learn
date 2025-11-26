"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Bell } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getAvatarById } from "@/config/avatars";
import { cn } from "@/lib/utils";

interface TopBarProps {
  onMenuClick?: () => void;
  showMenuButton?: boolean;
}

export function TopBar({ onMenuClick, showMenuButton = false }: TopBarProps) {
  const { userProfile } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const avatar = getAvatarById(userProfile?.avatarId || "avatar-1");

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-64 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6 z-40">
      {/* Left Side */}
      <div className="flex items-center gap-4">
        {showMenuButton && (
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 text-gray-600 hover:text-gray-900"
          >
            <Menu className="w-6 h-6" />
          </button>
        )}

        <div className="hidden sm:block">
          <p className="text-gray-900 font-medium">
            {getGreeting()}, {userProfile?.displayName || "Student"}!
          </p>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-3">
        {/* Streak Badge */}
        {(userProfile?.streakDays || 0) > 0 && (
          <div className="hidden sm:flex items-center gap-1 px-3 py-1.5 bg-orange-50 text-orange-600 rounded-full text-sm font-medium">
            <span>🔥</span>
            <span>{userProfile?.streakDays} day streak</span>
          </div>
        )}

        {/* XP Badge */}
        <div className="hidden sm:flex items-center gap-1 px-3 py-1.5 bg-primary-50 text-primary-600 rounded-full text-sm font-medium">
          <span>⚡</span>
          <span>{userProfile?.xp || 0} XP</span>
        </div>

        {/* Notifications */}
        <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg relative">
          <Bell className="w-5 h-5" />
          {/* Notification dot */}
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center text-xl",
              avatar?.bgColor || "bg-gray-100"
            )}
          >
            {avatar?.emoji || "👤"}
          </button>

          {showProfileMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowProfileMenu(false)}
              />
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                <Link
                  href="/settings"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                  onClick={() => setShowProfileMenu(false)}
                >
                  Settings
                </Link>
                <Link
                  href="/progress"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                  onClick={() => setShowProfileMenu(false)}
                >
                  My Progress
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
