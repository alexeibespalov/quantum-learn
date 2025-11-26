"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { completeOnboarding } from "@/lib/firebase/firestore";
import { OnboardingData } from "@/types";
import { ProgressIndicator } from "@/components/onboarding/ProgressIndicator";
import { WelcomeStep } from "@/components/onboarding/WelcomeStep";
import { DiagnosticStep } from "@/components/onboarding/DiagnosticStep";
import { GoalsStep } from "@/components/onboarding/GoalsStep";

export default function OnboardingPage() {
  const { user, userProfile, loading, refreshProfile } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace("/login");
      } else if (userProfile?.onboardingCompleted) {
        router.replace("/dashboard");
      }
      // Email verification check disabled for now
    }
  }, [user, userProfile, loading, router]);

  const handleStep1Complete = (stepData: {
    displayName: string;
    avatarId: string;
  }) => {
    setData((prev) => ({ ...prev, ...stepData }));
    setStep(2);
  };

  const handleStep2Complete = (stepData: {
    diagnosticResults: OnboardingData["diagnosticResults"];
    diagnosticResponses: OnboardingData["diagnosticResponses"];
  }) => {
    setData((prev) => ({ ...prev, ...stepData }));
    setStep(3);
  };

  const handleStep3Complete = async (stepData: {
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
  }) => {
    if (!user) return;

    setSaving(true);
    try {
      const completeData: OnboardingData = {
        ...data,
        ...stepData,
      };

      await completeOnboarding(user.uid, completeData);
      await refreshProfile();
      router.push("/dashboard");
    } catch (error) {
      console.error("Error completing onboarding:", error);
      alert("Failed to save your preferences. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ProgressIndicator currentStep={step} totalSteps={3} />

      <div className="py-8">
        {step === 1 && (
          <WelcomeStep
            onNext={handleStep1Complete}
            initialData={{
              displayName: data.displayName,
              avatarId: data.avatarId,
            }}
          />
        )}

        {step === 2 && <DiagnosticStep onNext={handleStep2Complete} />}

        {step === 3 && (
          <GoalsStep onComplete={handleStep3Complete} loading={saving} />
        )}
      </div>
    </div>
  );
}
