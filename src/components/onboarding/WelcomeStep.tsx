"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { avatars, Avatar } from "@/config/avatars";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";

const welcomeSchema = z.object({
  displayName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(30, "Name must be less than 30 characters"),
});

type WelcomeFormData = z.infer<typeof welcomeSchema>;

interface WelcomeStepProps {
  onNext: (data: { displayName: string; avatarId: string }) => void;
  initialData?: { displayName?: string; avatarId?: string };
}

export function WelcomeStep({ onNext, initialData }: WelcomeStepProps) {
  const [selectedAvatar, setSelectedAvatar] = useState<string>(
    initialData?.avatarId || "avatar-1"
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<WelcomeFormData>({
    resolver: zodResolver(welcomeSchema),
    defaultValues: {
      displayName: initialData?.displayName || "",
    },
  });

  const onSubmit = (data: WelcomeFormData) => {
    onNext({
      displayName: data.displayName,
      avatarId: selectedAvatar,
    });
  };

  return (
    <div className="max-w-lg mx-auto px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome to QuantumLearn!
        </h1>
        <p className="text-gray-600">
          Choose your learning companion and tell us your name
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Avatar Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Choose your avatar
          </label>
          <div className="grid grid-cols-4 gap-3">
            {avatars.map((avatar: Avatar) => (
              <button
                key={avatar.id}
                type="button"
                onClick={() => setSelectedAvatar(avatar.id)}
                className={cn(
                  "aspect-square rounded-xl flex items-center justify-center text-4xl transition-all",
                  avatar.bgColor,
                  selectedAvatar === avatar.id
                    ? "ring-4 ring-primary-500 ring-offset-2 scale-105"
                    : "hover:scale-105"
                )}
              >
                {avatar.emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Name Input */}
        <Input
          id="displayName"
          label="What should we call you?"
          placeholder="Enter your name"
          error={errors.displayName?.message}
          {...register("displayName")}
        />

        <Button type="submit" className="w-full" size="lg">
          Continue
        </Button>
      </form>
    </div>
  );
}
