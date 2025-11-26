"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  BookOpen,
  RefreshCw,
  MessageCircle,
  BarChart2,
  Settings,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { signOut } from "@/lib/firebase/auth";
import { getAvatarById } from "@/config/avatars";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/dashboard", icon: Home, label: "Dashboard" },
  { path: "/subjects", icon: BookOpen, label: "Subjects" },
  { path: "/review", icon: RefreshCw, label: "Review" },
  { path: "/tutor", icon: MessageCircle, label: "AI Tutor" },
  { path: "/progress", icon: BarChart2, label: "Progress" },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const { userProfile } = useAuth();

  const avatar = getAvatarById(userProfile?.avatarId || "avatar-1");
  const xpForLevel = 500;
  const currentXp = userProfile?.xp || 0;
  const xpProgress = (currentXp % xpForLevel) / xpForLevel * 100;

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-full w-64 bg-card border-r border-border flex flex-col",
        className
      )}
    >
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <h1 className="text-xl font-bold text-primary">QuantumLearn</h1>
      </div>

            {/* User Profile */}
            <div className="p-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center text-2xl",
                    avatar?.bgColor || "bg-muted"
                  )}
                >
                  {avatar?.emoji || "👤"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">
                    {userProfile?.displayName || "Student"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Level {userProfile?.level || 1}
                  </p>
                </div>
              </div>
      
              {/* XP Progress */}
              <div className="mt-3">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>{currentXp % xpForLevel} XP</span>
                  <span>{xpForLevel} XP</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${xpProgress}%` }}
                  />
                </div>
              </div>
        {/* Streak */}
        {(userProfile?.streakDays || 0) > 0 && (
          <div className="mt-2 flex items-center gap-1 text-orange-500">
            <span>🔥</span>
            <span className="text-sm font-medium">
              {userProfile?.streakDays} day streak
            </span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;

            return (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-accent/10 hover:text-foreground"
                  )}
                >
                  <Icon
                    className={cn("w-5 h-5", isActive ? "text-primary" : "text-muted-foreground")}
                  />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-border">
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
            pathname === "/settings"
              ? "bg-primary/10 text-primary font-medium"
              : "text-muted-foreground hover:bg-accent/10 hover:text-foreground"
          )}
        >
          <Settings className="w-5 h-5" />
          Settings
        </Link>

        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
