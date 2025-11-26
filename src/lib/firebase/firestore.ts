import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  Timestamp,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./config";
import { UserProfile, OnboardingData } from "@/types";

function getDbInstance() {
  if (!db) throw new Error("Firestore not initialized");
  return db;
}

export async function createUserProfile(
  uid: string,
  data: Partial<UserProfile>
): Promise<void> {
  const userRef = doc(getDbInstance(), "users", uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    const newUser: Partial<UserProfile> = {
      uid,
      email: data.email || "",
      displayName: data.displayName || "",
      avatarId: data.avatarId || "avatar-1",
      year: "year9",
      createdAt: serverTimestamp() as Timestamp,
      lastLoginAt: serverTimestamp() as Timestamp,
      onboardingCompleted: false,
      dailyGoalMinutes: 30,
      prioritySubjects: [],
      notifications: {
        dailyReminder: true,
        reviewAlerts: true,
      },
      accessibility: {
        fontSize: "medium",
        highContrast: false,
      },
      xp: 0,
      level: 1,
      streakDays: 0,
    };

    await setDoc(userRef, newUser);
  } else {
    // Update last login
    await updateDoc(userRef, {
      lastLoginAt: serverTimestamp(),
    });
  }
}

export async function getUserProfile(
  uid: string
): Promise<UserProfile | null> {
  const userRef = doc(getDbInstance(), "users", uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    return userSnap.data() as UserProfile;
  }

  return null;
}

export async function updateUserProfile(
  uid: string,
  data: Partial<UserProfile>
): Promise<void> {
  const userRef = doc(getDbInstance(), "users", uid);
  await updateDoc(userRef, data);
}

export async function completeOnboarding(
  uid: string,
  onboardingData: OnboardingData
): Promise<void> {
  const userRef = doc(getDbInstance(), "users", uid);

  await updateDoc(userRef, {
    displayName: onboardingData.displayName,
    avatarId: onboardingData.avatarId,
    dailyGoalMinutes: onboardingData.dailyGoalMinutes,
    prioritySubjects: onboardingData.prioritySubjects,
    notifications: onboardingData.notifications,
    accessibility: onboardingData.accessibility,
    diagnosticResults: onboardingData.diagnosticResults,
    onboardingCompleted: true,
    onboardingCompletedAt: serverTimestamp(),
  });
}
