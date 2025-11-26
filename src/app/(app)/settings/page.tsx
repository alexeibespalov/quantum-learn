"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { updateUserProfile } from "@/lib/firebase/firestore";
import { signOut } from "@/lib/firebase/auth";
import { avatars, getAvatarById } from "@/config/avatars";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import { User, BookOpen, Bell, Type, LogOut } from "lucide-react";

type TabType = "profile" | "learning" | "notifications" | "accessibility";

export default function SettingsPage() {
  const { user, userProfile, refreshProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>("profile");
  const [saving, setSaving] = useState(false);

  // Local state for form
  const [displayName, setDisplayName] = useState(userProfile?.displayName || "");
  const [selectedAvatar, setSelectedAvatar] = useState(
    userProfile?.avatarId || "avatar-1"
  );
  const [dailyGoal, setDailyGoal] = useState(userProfile?.dailyGoalMinutes || 30);
  const [dailyReminder, setDailyReminder] = useState(
    userProfile?.notifications?.dailyReminder ?? true
  );
  const [reviewAlerts, setReviewAlerts] = useState(
    userProfile?.notifications?.reviewAlerts ?? true
  );
  const [fontSize, setFontSize] = useState(
    userProfile?.accessibility?.fontSize || "medium"
  );
  const [highContrast, setHighContrast] = useState(
    userProfile?.accessibility?.highContrast || false
  );

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      await updateUserProfile(user.uid, {
        displayName,
        avatarId: selectedAvatar,
        dailyGoalMinutes: dailyGoal as 15 | 30 | 45 | 60,
        notifications: {
          dailyReminder,
          reviewAlerts,
        },
        accessibility: {
          fontSize: fontSize as "small" | "medium" | "large",
          highContrast,
        },
      });
      await refreshProfile();
      alert("Settings saved!");
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const tabs = [
    { id: "profile" as const, label: "Profile", icon: User },
    { id: "learning" as const, label: "Learning", icon: BookOpen },
    { id: "notifications" as const, label: "Notifications", icon: Bell },
    { id: "accessibility" as const, label: "Accessibility", icon: Type },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Tabs */}
        <div className="lg:w-48 flex lg:flex-col gap-1 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors",
                  activeTab === tab.id
                    ? "bg-primary-100 text-primary-700"
                    : "text-gray-600 hover:bg-gray-100"
                )}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 bg-white rounded-xl shadow-sm p-6">
          {activeTab === "profile" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold mb-4">Avatar</h2>
                <div className="grid grid-cols-4 gap-3">
                  {avatars.map((avatar) => (
                    <button
                      key={avatar.id}
                      onClick={() => setSelectedAvatar(avatar.id)}
                      className={cn(
                        "aspect-square rounded-xl flex items-center justify-center text-3xl transition-all",
                        avatar.bgColor,
                        selectedAvatar === avatar.id
                          ? "ring-4 ring-primary-500 ring-offset-2"
                          : "hover:scale-105"
                      )}
                    >
                      {avatar.emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Input
                  label="Display Name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <p className="text-gray-600">{user?.email}</p>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm text-gray-500">
                  Member since{" "}
                  {userProfile?.createdAt?.toDate?.()?.toLocaleDateString() ||
                    "N/A"}
                </p>
                <p className="text-sm text-gray-500">
                  Total XP: {userProfile?.xp || 0} • Level{" "}
                  {userProfile?.level || 1}
                </p>
              </div>
            </div>
          )}

          {activeTab === "learning" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold mb-4">Daily Study Goal</h2>
                <div className="grid grid-cols-4 gap-3">
                  {([15, 30, 45, 60] as const).map((mins) => (
                    <button
                      key={mins}
                      onClick={() => setDailyGoal(mins)}
                      className={cn(
                        "p-4 rounded-lg border-2 text-center transition-all",
                        dailyGoal === mins
                          ? "border-primary-500 bg-primary-50"
                          : "border-gray-200 hover:border-gray-300"
                      )}
                    >
                      <span className="block font-semibold">{mins} min</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-6">
              <label className="flex items-center justify-between">
                <span className="text-gray-700">Daily reminder</span>
                <button
                  onClick={() => setDailyReminder(!dailyReminder)}
                  className={cn(
                    "w-12 h-6 rounded-full transition-colors relative",
                    dailyReminder ? "bg-primary-600" : "bg-gray-300"
                  )}
                >
                  <div
                    className={cn(
                      "w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all",
                      dailyReminder ? "left-[26px]" : "left-[2px]"
                    )}
                  />
                </button>
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
                  <div
                    className={cn(
                      "w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all",
                      reviewAlerts ? "left-[26px]" : "left-[2px]"
                    )}
                  />
                </button>
              </label>
            </div>
          )}

          {activeTab === "accessibility" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Font Size
                </h3>
                <div className="flex gap-2">
                  {["small", "medium", "large"].map((size) => (
                    <button
                      key={size}
                      onClick={() =>
                        setFontSize(size as "small" | "medium" | "large")
                      }
                      className={cn(
                        "w-12 h-12 rounded-lg border-2 flex items-center justify-center transition-all",
                        size === "small"
                          ? "text-sm"
                          : size === "large"
                          ? "text-lg"
                          : "text-base",
                        fontSize === size
                          ? "border-primary-500 bg-primary-50"
                          : "border-gray-200 hover:border-gray-300"
                      )}
                    >
                      A
                    </button>
                  ))}
                </div>
              </div>

              <label className="flex items-center justify-between">
                <span className="text-gray-700">High contrast mode</span>
                <button
                  onClick={() => setHighContrast(!highContrast)}
                  className={cn(
                    "w-12 h-6 rounded-full transition-colors relative",
                    highContrast ? "bg-primary-600" : "bg-gray-300"
                  )}
                >
                  <div
                    className={cn(
                      "w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all",
                      highContrast ? "left-[26px]" : "left-[2px]"
                    )}
                  />
                </button>
              </label>
            </div>
          )}

          <div className="mt-6 pt-6 border-t flex justify-between">
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign out
            </Button>
            <Button onClick={handleSave} loading={saving}>
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
