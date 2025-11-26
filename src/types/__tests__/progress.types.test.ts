import { describe, it, expect } from "vitest";
import { Timestamp } from "firebase/firestore";
import type {
  LessonProgress,
  ModuleProgress,
  CourseProgress,
  UserCourseProgress,
  LessonStatus,
  ModuleStatus,
} from "../progress";

describe("Progress Types", () => {
  describe("LessonProgress", () => {
    it("should validate not_started lesson progress", () => {
      const progress: LessonProgress = {
        status: "not_started",
        startedAt: Timestamp.now(),
        timeSpent: 0,
        lastPosition: 0,
        attempts: 0,
      };

      expect(progress.status).toBe("not_started");
      expect(progress.timeSpent).toBe(0);
      expect(progress.lastPosition).toBe(0);
      expect(progress.completedAt).toBeUndefined();
    });

    it("should validate in_progress lesson progress", () => {
      const progress: LessonProgress = {
        status: "in_progress",
        startedAt: Timestamp.now(),
        timeSpent: 300, // 5 minutes
        lastPosition: 120, // 2 minutes into video
        attempts: 1,
      };

      expect(progress.status).toBe("in_progress");
      expect(progress.timeSpent).toBeGreaterThan(0);
      expect(progress.lastPosition).toBeGreaterThan(0);
      expect(progress.completedAt).toBeUndefined();
    });

    it("should validate completed lesson progress", () => {
      const progress: LessonProgress = {
        status: "completed",
        startedAt: Timestamp.now(),
        completedAt: Timestamp.now(),
        timeSpent: 600, // 10 minutes
        lastPosition: 600, // End of video
        score: 85,
        attempts: 1,
      };

      expect(progress.status).toBe("completed");
      expect(progress.completedAt).toBeDefined();
      expect(progress.score).toBeDefined();
      expect(progress.score).toBeGreaterThanOrEqual(0);
      expect(progress.score).toBeLessThanOrEqual(100);
    });
  });

  describe("ModuleProgress", () => {
    it("should validate locked module progress", () => {
      const progress: ModuleProgress = {
        status: "locked",
        completedLessons: 0,
        totalLessons: 5,
      };

      expect(progress.status).toBe("locked");
      expect(progress.completedLessons).toBe(0);
      expect(progress.totalLessons).toBeGreaterThan(0);
    });

    it("should validate available module progress", () => {
      const progress: ModuleProgress = {
        status: "available",
        completedLessons: 0,
        totalLessons: 5,
      };

      expect(progress.status).toBe("available");
    });

    it("should validate in_progress module progress", () => {
      const progress: ModuleProgress = {
        status: "in_progress",
        completedLessons: 2,
        totalLessons: 5,
        startedAt: Timestamp.now(),
      };

      expect(progress.status).toBe("in_progress");
      expect(progress.completedLessons).toBeGreaterThan(0);
      expect(progress.completedLessons).toBeLessThan(progress.totalLessons);
    });

    it("should validate completed module progress", () => {
      const progress: ModuleProgress = {
        status: "completed",
        completedLessons: 5,
        totalLessons: 5,
        startedAt: Timestamp.now(),
        completedAt: Timestamp.now(),
      };

      expect(progress.status).toBe("completed");
      expect(progress.completedLessons).toBe(progress.totalLessons);
      expect(progress.completedAt).toBeDefined();
    });
  });

  describe("CourseProgress", () => {
    it("should validate course progress structure", () => {
      const progress: CourseProgress = {
        overallPercentage: 42,
        completedModules: 2,
        totalModules: 5,
        masteryLevel: 2,
        startedAt: Timestamp.now(),
        lastActivityAt: Timestamp.now(),
      };

      expect(progress.overallPercentage).toBeGreaterThanOrEqual(0);
      expect(progress.overallPercentage).toBeLessThanOrEqual(100);
      expect(progress.completedModules).toBeLessThanOrEqual(progress.totalModules);
      expect(progress.masteryLevel).toBeGreaterThanOrEqual(1);
      expect(progress.masteryLevel).toBeLessThanOrEqual(5);
    });

    it("should validate course progress with 0% completion", () => {
      const progress: CourseProgress = {
        overallPercentage: 0,
        completedModules: 0,
        totalModules: 3,
        masteryLevel: 1,
      };

      expect(progress.overallPercentage).toBe(0);
      expect(progress.completedModules).toBe(0);
    });

    it("should validate course progress with 100% completion", () => {
      const progress: CourseProgress = {
        overallPercentage: 100,
        completedModules: 5,
        totalModules: 5,
        masteryLevel: 5,
        startedAt: Timestamp.now(),
        completedAt: Timestamp.now(),
      };

      expect(progress.overallPercentage).toBe(100);
      expect(progress.completedModules).toBe(progress.totalModules);
      expect(progress.masteryLevel).toBe(5);
    });
  });

  describe("UserCourseProgress", () => {
    it("should validate user course progress structure", () => {
      const progress: UserCourseProgress = {
        userId: "user123",
        courseId: "course456",
        lessonProgress: {
          "lesson1": {
            status: "completed",
            startedAt: Timestamp.now(),
            completedAt: Timestamp.now(),
            timeSpent: 600,
            lastPosition: 600,
            score: 90,
            attempts: 1,
          },
        },
        moduleProgress: {
          "module1": {
            status: "in_progress",
            completedLessons: 2,
            totalLessons: 5,
          },
        },
        courseProgress: {
          overallPercentage: 25,
          completedModules: 0,
          totalModules: 3,
          masteryLevel: 1,
        },
        lastUpdated: Timestamp.now(),
      };

      expect(progress.userId).toBeDefined();
      expect(progress.courseId).toBeDefined();
      expect(typeof progress.lessonProgress).toBe("object");
      expect(typeof progress.moduleProgress).toBe("object");
      expect(progress.courseProgress).toBeDefined();
      expect(progress.lastUpdated).toBeInstanceOf(Timestamp);
    });

    it("should validate empty user course progress", () => {
      const progress: UserCourseProgress = {
        userId: "user123",
        courseId: "course456",
        lessonProgress: {},
        moduleProgress: {},
        courseProgress: {
          overallPercentage: 0,
          completedModules: 0,
          totalModules: 3,
          masteryLevel: 1,
        },
        lastUpdated: Timestamp.now(),
      };

      expect(Object.keys(progress.lessonProgress).length).toBe(0);
      expect(Object.keys(progress.moduleProgress).length).toBe(0);
      expect(progress.courseProgress.overallPercentage).toBe(0);
    });
  });
});

