"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const { user, loading, userProfile } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/login");
    } else if (!userProfile?.onboardingCompleted) {
      router.replace("/onboarding");
    } else {
      router.replace("/dashboard");
    }
    // Email verification check disabled for now
  }, [user, loading, userProfile, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>
  );
}
