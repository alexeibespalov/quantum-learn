"use client";

import { cn } from "@/lib/utils";

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const stepLabels = ["Welcome", "Assessment", "Goals"];

export function ProgressIndicator({
  currentStep,
  totalSteps,
}: ProgressIndicatorProps) {
  return (
    <div className="w-full py-4 px-6">
      <div className="flex items-center justify-between max-w-md mx-auto">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
          <div key={step} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center font-medium transition-colors",
                  step < currentStep
                    ? "bg-primary-600 text-white"
                    : step === currentStep
                    ? "bg-primary-600 text-white ring-4 ring-primary-200"
                    : "bg-gray-200 text-gray-500"
                )}
              >
                {step < currentStep ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  step
                )}
              </div>
              <span
                className={cn(
                  "text-xs mt-1",
                  step <= currentStep ? "text-primary-600 font-medium" : "text-gray-400"
                )}
              >
                {stepLabels[step - 1]}
              </span>
            </div>
            {step < totalSteps && (
              <div
                className={cn(
                  "w-16 h-1 mx-2 rounded",
                  step < currentStep ? "bg-primary-600" : "bg-gray-200"
                )}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
