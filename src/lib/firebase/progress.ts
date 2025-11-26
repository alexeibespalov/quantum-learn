import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "./config";
import type {
  UserCourseProgress,
  LessonProgress,
  ModuleProgress,
  CourseProgress,
} from "@/types/progress";
import { getCourse } from "./courses";
import type { Course } from "@/types/course";

const DEFAULT_LESSON_PROGRESS: LessonProgress = {
  status: "not_started",
  startedAt: Timestamp.now(),
  timeSpent: 0,
  lastPosition: 0,
  attempts: 0,
};

const DEFAULT_MODULE_PROGRESS: ModuleProgress = {
  status: "locked",
  completedLessons: 0,
  totalLessons: 0,
};

const DEFAULT_COURSE_PROGRESS: CourseProgress = {
  overallPercentage: 0,
  completedModules: 0,
  totalModules: 0,
  masteryLevel: 1,
};

export async function getUserProgress(
  userId: string,
  courseId: string
): Promise<UserCourseProgress | null> {
  if (!db) {
    throw new Error("Firestore not initialized");
  }

  const progressRef = doc(
    db,
    "user_progress",
    userId,
    "courses",
    courseId
  );
  const progressSnap = await getDoc(progressRef);

  if (progressSnap.exists()) {
    const data = progressSnap.data();
    return {
      ...data,
      userId,
      courseId,
      lastUpdated: data.lastUpdated as Timestamp,
    } as UserCourseProgress;
  }

  // Create default progress if it doesn't exist
  const course = await getCourse(courseId);
  if (!course) {
    return null;
  }

  const defaultProgress: UserCourseProgress = {
    userId,
    courseId,
    lessonProgress: {},
    moduleProgress: {},
    courseProgress: {
      ...DEFAULT_COURSE_PROGRESS,
      totalModules: course.modules.length,
    },
    lastUpdated: Timestamp.now(),
  };

  // Initialize module progress
  course.modules.forEach((module) => {
    defaultProgress.moduleProgress[module.id] = {
      ...DEFAULT_MODULE_PROGRESS,
      totalLessons: module.lessons.length,
      status: module.prerequisites && module.prerequisites.length > 0 ? "locked" : "available",
    };
  });

  await setDoc(progressRef, defaultProgress);
  return defaultProgress;
}

export async function updateLessonProgress(
  userId: string,
  courseId: string,
  lessonId: string,
  updates: Partial<LessonProgress>
): Promise<void> {
  if (!db) {
    throw new Error("Firestore not initialized");
  }

  const progressRef = doc(
    db,
    "user_progress",
    userId,
    "courses",
    courseId
  );
  const progressSnap = await getDoc(progressRef);

  let progress: UserCourseProgress;
  if (progressSnap.exists()) {
    progress = progressSnap.data() as UserCourseProgress;
  } else {
    // Create default progress
    const defaultProgress = await getUserProgress(userId, courseId);
    if (!defaultProgress) {
      throw new Error("Course not found");
    }
    progress = defaultProgress;
  }

  // Update lesson progress
  const currentLessonProgress = progress.lessonProgress[lessonId] || {
    ...DEFAULT_LESSON_PROGRESS,
    startedAt: Timestamp.now(),
  };

  const updatedLessonProgress: LessonProgress = {
    ...currentLessonProgress,
    ...updates,
    attempts: currentLessonProgress.attempts + (updates.status ? 1 : 0),
  };

  progress.lessonProgress[lessonId] = updatedLessonProgress;

  // Update module and course progress
  await recalculateProgress(userId, courseId, progress);

  await updateDoc(progressRef, {
    lessonProgress: progress.lessonProgress,
    moduleProgress: progress.moduleProgress,
    courseProgress: progress.courseProgress,
    lastUpdated: serverTimestamp(),
  });
}

export async function markLessonComplete(
  userId: string,
  courseId: string,
  lessonId: string,
  score: number
): Promise<void> {
  await updateLessonProgress(userId, courseId, lessonId, {
    status: "completed",
    completedAt: Timestamp.now(),
    score: Math.max(0, Math.min(100, score)),
  });
}

export async function calculateModuleProgress(
  userId: string,
  courseId: string,
  moduleId: string
): Promise<number> {
  const progress = await getUserProgress(userId, courseId);
  if (!progress) {
    return 0;
  }

  const moduleProgress = progress.moduleProgress[moduleId];
  if (!moduleProgress || moduleProgress.totalLessons === 0) {
    return 0;
  }

  return (moduleProgress.completedLessons / moduleProgress.totalLessons) * 100;
}

export async function calculateCourseProgress(
  userId: string,
  courseId: string
): Promise<number> {
  const progress = await getUserProgress(userId, courseId);
  if (!progress) {
    return 0;
  }

  return progress.courseProgress.overallPercentage;
}

export async function saveVideoPosition(
  userId: string,
  courseId: string,
  lessonId: string,
  position: number
): Promise<void> {
  await updateLessonProgress(userId, courseId, lessonId, {
    lastPosition: position,
    status: "in_progress",
  });
}

export async function getResumePosition(
  userId: string,
  courseId: string,
  lessonId: string
): Promise<number> {
  const progress = await getUserProgress(userId, courseId);
  if (!progress) {
    return 0;
  }

  const lessonProgress = progress.lessonProgress[lessonId];
  return lessonProgress?.lastPosition || 0;
}

async function recalculateProgress(
  userId: string,
  courseId: string,
  progress: UserCourseProgress
): Promise<void> {
  const course = await getCourse(courseId);
  if (!course) {
    return;
  }

  // Recalculate module progress
  course.modules.forEach((module) => {
    const moduleProgress = progress.moduleProgress[module.id] || {
      ...DEFAULT_MODULE_PROGRESS,
      totalLessons: module.lessons.length,
    };

    let completedLessons = 0;
    module.lessons.forEach((lesson) => {
      const lessonProgress = progress.lessonProgress[lesson.id];
      if (lessonProgress?.status === "completed") {
        completedLessons++;
      }
    });

    moduleProgress.completedLessons = completedLessons;
    moduleProgress.totalLessons = module.lessons.length;

    // Update module status
    if (completedLessons === 0) {
      // Check prerequisites
      const prerequisitesMet = !module.prerequisites || module.prerequisites.every(
        (prereqId) => {
          const prereqModule = progress.moduleProgress[prereqId];
          return prereqModule?.status === "completed";
        }
      );
      moduleProgress.status = prerequisitesMet ? "available" : "locked";
    } else if (completedLessons === module.lessons.length) {
      moduleProgress.status = "completed";
      moduleProgress.completedAt = Timestamp.now();
    } else {
      moduleProgress.status = "in_progress";
      if (!moduleProgress.startedAt) {
        moduleProgress.startedAt = Timestamp.now();
      }
    }

    progress.moduleProgress[module.id] = moduleProgress;
  });

  // Recalculate course progress
  let completedModules = 0;
  course.modules.forEach((module) => {
    const moduleProgress = progress.moduleProgress[module.id];
    if (moduleProgress?.status === "completed") {
      completedModules++;
    }
  });

  progress.courseProgress.completedModules = completedModules;
  progress.courseProgress.totalModules = course.modules.length;
  progress.courseProgress.overallPercentage =
    course.modules.length > 0
      ? (completedModules / course.modules.length) * 100
      : 0;

  // Calculate mastery level (1-5 based on percentage)
  const percentage = progress.courseProgress.overallPercentage;
  if (percentage >= 90) {
    progress.courseProgress.masteryLevel = 5;
  } else if (percentage >= 70) {
    progress.courseProgress.masteryLevel = 4;
  } else if (percentage >= 50) {
    progress.courseProgress.masteryLevel = 3;
  } else if (percentage >= 30) {
    progress.courseProgress.masteryLevel = 2;
  } else {
    progress.courseProgress.masteryLevel = 1;
  }

  if (!progress.courseProgress.startedAt && completedModules > 0) {
    progress.courseProgress.startedAt = Timestamp.now();
  }

  if (completedModules === course.modules.length) {
    progress.courseProgress.lastActivityAt = Timestamp.now();
  }
}

