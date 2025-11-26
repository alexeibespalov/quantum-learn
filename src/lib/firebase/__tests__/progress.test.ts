import { describe, it, expect, vi, beforeEach } from "vitest";
import { Timestamp } from "firebase/firestore";
import {
  getUserProgress,
  updateLessonProgress,
  markLessonComplete,
  calculateModuleProgress,
  calculateCourseProgress,
  saveVideoPosition,
  getResumePosition,
} from "../progress";
import type { UserCourseProgress, LessonProgress } from "@/types/progress";

// Mock Firestore functions
const mockDoc = vi.fn();
const mockGetDoc = vi.fn();
const mockSetDoc = vi.fn();
const mockUpdateDoc = vi.fn();
const mockServerTimestamp = vi.fn(() => Timestamp.now());

// Create a mock db object
const mockDb = {};

vi.mock("firebase/firestore", async () => {
  const actual = await vi.importActual<typeof import("firebase/firestore")>("firebase/firestore");
  return {
    ...actual,
    doc: (...args: any[]) => mockDoc(...args),
    getDoc: (...args: any[]) => mockGetDoc(...args),
    setDoc: (...args: any[]) => mockSetDoc(...args),
    updateDoc: (...args: any[]) => mockUpdateDoc(...args),
    serverTimestamp: () => mockServerTimestamp(),
  };
});

// Mock the config
vi.mock("../config", () => {
  const mockDb = {};
  return {
    db: mockDb,
  };
});

// Mock courses module
vi.mock("../courses", () => ({
  getCourse: vi.fn(),
}));

describe("Progress Firestore Operations", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should throw error when db is not initialized", async () => {
    const originalDb = (await import("../config")).db;
    (await import("../config")).db = null as any;

    await expect(getUserProgress("user1", "course1")).rejects.toThrow(
      "Firestore not initialized"
    );

    (await import("../config")).db = originalDb;
  });

  it("should get user progress or create default", async () => {
    const { getCourse } = await import("../courses");
    const mockCourse = {
      id: "course1",
      modules: [
        {
          id: "mod1",
          lessons: [{ id: "lesson1" }],
          prerequisites: [],
        },
      ],
    };

    vi.mocked(getCourse).mockResolvedValue(mockCourse as any);

    const mockDocRef = {};
    const mockDocSnap = {
      exists: () => false,
    };

    mockDoc.mockReturnValue(mockDocRef);
    mockGetDoc.mockResolvedValue(mockDocSnap);
    mockSetDoc.mockResolvedValue(undefined);

    const result = await getUserProgress("user1", "course1");

    expect(result).not.toBeNull();
    expect(result?.userId).toBe("user1");
    expect(result?.courseId).toBe("course1");
    expect(result?.courseProgress.totalModules).toBe(1);
    expect(mockSetDoc).toHaveBeenCalled();
  });

  it("should return existing user progress", async () => {
    const existingProgress: UserCourseProgress = {
      userId: "user1",
      courseId: "course1",
      lessonProgress: {},
      moduleProgress: {},
      courseProgress: {
        overallPercentage: 50,
        completedModules: 1,
        totalModules: 2,
        masteryLevel: 3,
      },
      lastUpdated: Timestamp.now(),
    };

    const mockDocRef = {};
    const mockDocSnap = {
      exists: () => true,
      data: () => existingProgress,
    };

    mockDoc.mockReturnValue(mockDocRef);
    mockGetDoc.mockResolvedValue(mockDocSnap);

    const result = await getUserProgress("user1", "course1");

    expect(result).not.toBeNull();
    expect(result?.courseProgress.overallPercentage).toBe(50);
  });

  it("should update lesson progress", async () => {
    const { getCourse } = await import("../courses");
    const existingProgress: UserCourseProgress = {
      userId: "user1",
      courseId: "course1",
      lessonProgress: {},
      moduleProgress: {
        mod1: {
          status: "available",
          completedLessons: 0,
          totalLessons: 2,
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

    const mockCourse = {
      id: "course1",
      modules: [
        {
          id: "mod1",
          lessons: [{ id: "lesson1" }],
          prerequisites: [],
        },
      ],
    };

    vi.mocked(getCourse).mockResolvedValue(mockCourse as any);

    const mockDocRef = {};
    const mockDocSnap = {
      exists: () => true,
      data: () => existingProgress,
    };

    mockDoc.mockReturnValue(mockDocRef);
    mockGetDoc.mockResolvedValue(mockDocSnap);
    mockUpdateDoc.mockResolvedValue(undefined);

    await updateLessonProgress("user1", "course1", "lesson1", {
      status: "in_progress",
      timeSpent: 300,
    });

    expect(mockUpdateDoc).toHaveBeenCalled();
  });

  it("should mark lesson as complete", async () => {
    const { getCourse } = await import("../courses");
    const existingProgress: UserCourseProgress = {
      userId: "user1",
      courseId: "course1",
      lessonProgress: {
        lesson1: {
          status: "in_progress",
          startedAt: Timestamp.now(),
          timeSpent: 300,
          lastPosition: 300,
          attempts: 1,
        },
      },
      moduleProgress: {
        mod1: {
          status: "in_progress",
          completedLessons: 0,
          totalLessons: 2,
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

    const mockCourse = {
      id: "course1",
      modules: [
        {
          id: "mod1",
          lessons: [{ id: "lesson1" }],
          prerequisites: [],
        },
      ],
    };

    vi.mocked(getCourse).mockResolvedValue(mockCourse as any);

    const mockDocRef = {};
    const mockDocSnap = {
      exists: () => true,
      data: () => existingProgress,
    };

    mockDoc.mockReturnValue(mockDocRef);
    mockGetDoc.mockResolvedValue(mockDocSnap);
    mockUpdateDoc.mockResolvedValue(undefined);

    await markLessonComplete("user1", "course1", "lesson1", 85);

    expect(mockUpdateDoc).toHaveBeenCalled();
  });

  it("should calculate module progress", async () => {
    const existingProgress: UserCourseProgress = {
      userId: "user1",
      courseId: "course1",
      lessonProgress: {},
      moduleProgress: {
        mod1: {
          status: "in_progress",
          completedLessons: 1,
          totalLessons: 4,
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

    const mockDocRef = {};
    const mockDocSnap = {
      exists: () => true,
      data: () => existingProgress,
    };

    mockDoc.mockReturnValue(mockDocRef);
    mockGetDoc.mockResolvedValue(mockDocSnap);

    const result = await calculateModuleProgress("user1", "course1", "mod1");

    expect(result).toBe(25); // 1/4 = 25%
  });

  it("should calculate course progress", async () => {
    const existingProgress: UserCourseProgress = {
      userId: "user1",
      courseId: "course1",
      lessonProgress: {},
      moduleProgress: {},
      courseProgress: {
        overallPercentage: 75,
        completedModules: 3,
        totalModules: 4,
        masteryLevel: 4,
      },
      lastUpdated: Timestamp.now(),
    };

    const mockDocRef = {};
    const mockDocSnap = {
      exists: () => true,
      data: () => existingProgress,
    };

    mockDoc.mockReturnValue(mockDocRef);
    mockGetDoc.mockResolvedValue(mockDocSnap);

    const result = await calculateCourseProgress("user1", "course1");

    expect(result).toBe(75);
  });

  it("should save video position", async () => {
    const { getCourse } = await import("../courses");
    const existingProgress: UserCourseProgress = {
      userId: "user1",
      courseId: "course1",
      lessonProgress: {},
      moduleProgress: {},
      courseProgress: {
        overallPercentage: 0,
        completedModules: 0,
        totalModules: 1,
        masteryLevel: 1,
      },
      lastUpdated: Timestamp.now(),
    };

    const mockCourse = {
      id: "course1",
      modules: [
        {
          id: "mod1",
          lessons: [{ id: "lesson1" }],
          prerequisites: [],
        },
      ],
    };

    vi.mocked(getCourse).mockResolvedValue(mockCourse as any);

    const mockDocRef = {};
    const mockDocSnap = {
      exists: () => true,
      data: () => existingProgress,
    };

    mockDoc.mockReturnValue(mockDocRef);
    mockGetDoc.mockResolvedValue(mockDocSnap);
    mockUpdateDoc.mockResolvedValue(undefined);

    await saveVideoPosition("user1", "course1", "lesson1", 120);

    expect(mockUpdateDoc).toHaveBeenCalled();
  });

  it("should get resume position", async () => {
    const existingProgress: UserCourseProgress = {
      userId: "user1",
      courseId: "course1",
      lessonProgress: {
        lesson1: {
          status: "in_progress",
          startedAt: Timestamp.now(),
          timeSpent: 300,
          lastPosition: 120,
          attempts: 1,
        },
      },
      moduleProgress: {},
      courseProgress: {
        overallPercentage: 0,
        completedModules: 0,
        totalModules: 1,
        masteryLevel: 1,
      },
      lastUpdated: Timestamp.now(),
    };

    const mockDocRef = {};
    const mockDocSnap = {
      exists: () => true,
      data: () => existingProgress,
    };

    mockDoc.mockReturnValue(mockDocRef);
    mockGetDoc.mockResolvedValue(mockDocSnap);

    const result = await getResumePosition("user1", "course1", "lesson1");

    expect(result).toBe(120);
  });

  it("should return 0 for resume position if lesson not started", async () => {
    const existingProgress: UserCourseProgress = {
      userId: "user1",
      courseId: "course1",
      lessonProgress: {},
      moduleProgress: {},
      courseProgress: {
        overallPercentage: 0,
        completedModules: 0,
        totalModules: 1,
        masteryLevel: 1,
      },
      lastUpdated: Timestamp.now(),
    };

    const mockDocRef = {};
    const mockDocSnap = {
      exists: () => true,
      data: () => existingProgress,
    };

    mockDoc.mockReturnValue(mockDocRef);
    mockGetDoc.mockResolvedValue(mockDocSnap);

    const result = await getResumePosition("user1", "course1", "lesson1");

    expect(result).toBe(0);
  });
});

