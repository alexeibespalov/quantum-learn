import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getSubjectsWithProgress,
  getSubjectDetails,
  filterSubjectsByStatus,
} from "../subjects";
import * as coursesLib from "@/lib/firebase/courses";
import * as progressLib from "@/lib/firebase/progress";
import type { Course } from "@/types/course";
import type { UserCourseProgress } from "@/types/progress";
import { Timestamp } from "firebase/firestore";

vi.mock("@/lib/firebase/courses");
vi.mock("@/lib/firebase/progress");
vi.mock("@/lib/firebase/config", () => ({
  db: {},
}));

describe("Subjects Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getSubjectsWithProgress", () => {
    it("should return all subjects with progress", async () => {
      const mockCourses: Course[] = [
        {
          id: "math-course-1",
          subjectId: "mathematics",
          title: "Math Course 1",
          description: "Description",
          icon: "calculator",
          level: 1,
          estimatedDuration: 60,
          prerequisites: [],
          modules: [],
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        },
      ];

      const mockProgress: UserCourseProgress = {
        userId: "user1",
        courseId: "math-course-1",
        lessonProgress: {},
        moduleProgress: {},
        courseProgress: {
          overallPercentage: 50,
          completedModules: 0,
          totalModules: 1,
          masteryLevel: 2,
        },
        lastUpdated: Timestamp.now(),
      };

      vi.mocked(coursesLib.getAllCourses).mockResolvedValue(mockCourses);
      vi.mocked(progressLib.getUserProgress).mockResolvedValue(mockProgress);

      const result = await getSubjectsWithProgress("user1");

      expect(result.length).toBeGreaterThan(0);
      const mathSubject = result.find((s) => s.id === "mathematics");
      expect(mathSubject).toBeDefined();
      expect(mathSubject?.progress).toBe(50);
      expect(mathSubject?.level).toBe(3); // 50% = level 3
    });
  });

  describe("getSubjectDetails", () => {
    it("should return subject details with modules and lessons", async () => {
      const mockCourse: Course = {
        id: "math-course-1",
        subjectId: "mathematics",
        title: "Math Course",
        description: "Description",
        icon: "calculator",
        level: 1,
        estimatedDuration: 60,
        prerequisites: [],
        modules: [
          {
            id: "mod1",
            title: "Module 1",
            description: "Description",
            order: 1,
            lessons: [
              {
                id: "lesson1",
                type: "video",
                title: "Lesson 1",
                description: "Description",
                duration: 10,
                order: 1,
                content: {
                  videoUrl: "https://example.com/video.mp4",
                  transcript: "Transcript",
                  duration: 600,
                },
                embeddedQuestions: [],
                comprehensionCheck: [],
              },
            ],
          },
        ],
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      const mockProgress: UserCourseProgress = {
        userId: "user1",
        courseId: "math-course-1",
        lessonProgress: {
          lesson1: {
            status: "in_progress",
            startedAt: Timestamp.now(),
            timeSpent: 300,
            lastPosition: 120,
            attempts: 1,
          },
        },
        moduleProgress: {
          mod1: {
            status: "in_progress",
            completedLessons: 0,
            totalLessons: 1,
          },
        },
        courseProgress: {
          overallPercentage: 0,
          completedModules: 0,
          totalModules: 1,
          masteryLevel: 1,
        },
        lastUpdated: Timestamp.now(),
      };

      vi.mocked(coursesLib.getCoursesBySubject).mockResolvedValue([mockCourse]);
      vi.mocked(progressLib.getUserProgress).mockResolvedValue(mockProgress);

      const result = await getSubjectDetails("mathematics", "user1");

      expect(result).not.toBeNull();
      expect(result?.id).toBe("mathematics");
      expect(result?.modules.length).toBe(1);
      expect(result?.modules[0].lessons.length).toBe(1);
      expect(result?.modules[0].lessons[0].status).toBe("in_progress");
    });

    it("should return null for invalid subject", async () => {
      const result = await getSubjectDetails("invalid-subject" as any, "user1");
      expect(result).toBeNull();
    });
  });

  describe("filterSubjectsByStatus", () => {
    it("should filter subjects by status", () => {
      const subjects = [
        { id: "math" as const, name: "Math", icon: "calc", progress: 0, level: 1, courses: [], totalCourses: 0, completedCourses: 0 },
        { id: "english" as const, name: "English", icon: "book", progress: 50, level: 2, courses: [], totalCourses: 0, completedCourses: 0 },
        { id: "french" as const, name: "French", icon: "lang", progress: 100, level: 5, courses: [], totalCourses: 0, completedCourses: 0 },
      ];

      const inProgress = filterSubjectsByStatus(subjects, "in-progress");
      expect(inProgress.length).toBe(1);
      expect(inProgress[0].id).toBe("english");

      const notStarted = filterSubjectsByStatus(subjects, "not-started");
      expect(notStarted.length).toBe(1);
      expect(notStarted[0].id).toBe("math");

      const all = filterSubjectsByStatus(subjects, "all");
      expect(all.length).toBe(3);
    });
  });
});

