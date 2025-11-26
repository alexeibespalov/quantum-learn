import { Timestamp } from "firebase/firestore";

export type LessonStatus = "not_started" | "in_progress" | "completed";
export type ModuleStatus = "locked" | "available" | "in_progress" | "completed";

export interface LessonProgress {
  status: LessonStatus;
  startedAt: Timestamp;
  completedAt?: Timestamp;
  timeSpent: number; // seconds
  lastPosition: number; // video timestamp (seconds) or section index for text lessons
  score?: number; // 0-100
  attempts: number;
  lastAttemptAt?: Timestamp;
}

export interface ModuleProgress {
  status: ModuleStatus;
  completedLessons: number;
  totalLessons: number;
  startedAt?: Timestamp;
  completedAt?: Timestamp;
}

export interface CourseProgress {
  overallPercentage: number; // 0-100
  completedModules: number;
  totalModules: number;
  masteryLevel: 1 | 2 | 3 | 4 | 5;
  startedAt?: Timestamp;
  lastActivityAt?: Timestamp;
}

export interface UserCourseProgress {
  userId: string;
  courseId: string;
  lessonProgress: Record<string, LessonProgress>; // Map<lessonId, LessonProgress>
  moduleProgress: Record<string, ModuleProgress>; // Map<moduleId, ModuleProgress>
  courseProgress: CourseProgress;
  lastUpdated: Timestamp;
}

