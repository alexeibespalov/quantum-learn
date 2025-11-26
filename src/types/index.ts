import { Timestamp } from "firebase/firestore";

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  avatarId: string;
  school?: string;
  year: "year9";
  createdAt: Timestamp;
  lastLoginAt: Timestamp;

  // Onboarding status
  onboardingCompleted: boolean;
  onboardingCompletedAt?: Timestamp;

  // Goals (from onboarding step 3)
  dailyGoalMinutes: 15 | 30 | 45 | 60;
  prioritySubjects: string[];

  // Notifications
  notifications: {
    dailyReminder: boolean;
    reminderTime?: string;
    reviewAlerts: boolean;
  };

  // Accessibility
  accessibility: {
    fontSize: "small" | "medium" | "large";
    highContrast: boolean;
  };

  // Gamification
  xp: number;
  level: number;
  streakDays: number;
  lastActivityDate?: string;

  // Initial diagnostic results
  diagnosticResults?: DiagnosticResults;
}

export interface DiagnosticResults {
  maths: number;
  english: number;
  science: number;
  french: number;
  completedAt: Timestamp;
}

export interface DiagnosticResponse {
  questionId: string;
  correct: boolean;
  difficulty: number;
  subject: string;
  timeSpent: number;
}

export interface OnboardingData {
  // Step 1
  displayName?: string;
  avatarId?: string;

  // Step 2
  diagnosticResults?: DiagnosticResults;
  diagnosticResponses?: DiagnosticResponse[];

  // Step 3
  dailyGoalMinutes?: 15 | 30 | 45 | 60;
  prioritySubjects?: string[];
  notifications?: {
    dailyReminder: boolean;
    reminderTime?: string;
    reviewAlerts: boolean;
  };
  accessibility?: {
    fontSize: "small" | "medium" | "large";
    highContrast: boolean;
  };
}

export interface DiagnosticQuestion {
  id: string;
  subject: "maths" | "english" | "science" | "french";
  difficulty: number;
  text: string;
  options: string[];
  correctIndex: number;
}

export const SUBJECTS = [
  { id: "mathematics", name: "Mathematics", icon: "calculator" },
  { id: "english", name: "English Language & Literature", icon: "book-open" },
  { id: "biology", name: "Biology", icon: "leaf" },
  { id: "chemistry", name: "Chemistry", icon: "flask-conical" },
  { id: "physics", name: "Physics", icon: "atom" },
  { id: "french", name: "French", icon: "languages" },
  { id: "history", name: "History", icon: "landmark" },
  { id: "geography", name: "Geography", icon: "globe" },
  { id: "computing", name: "Computing", icon: "code" },
  { id: "religious-studies", name: "Religious Studies", icon: "church" },
  { id: "art", name: "Art & Design", icon: "palette" },
  { id: "pe", name: "Physical Education", icon: "dumbbell" },
] as const;

export type SubjectId = (typeof SUBJECTS)[number]["id"];
