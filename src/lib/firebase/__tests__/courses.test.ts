import { describe, it, expect, vi, beforeEach } from "vitest";
import { Timestamp } from "firebase/firestore";
import {
  getCourse,
  getCoursesBySubject,
  getAllCourses,
  getModule,
  getLesson,
} from "../courses";
import type { Course } from "@/types/course";

// Mock Firestore functions
const mockDoc = vi.fn();
const mockGetDoc = vi.fn();
const mockCollection = vi.fn();
const mockGetDocs = vi.fn();
const mockQuery = vi.fn();
const mockWhere = vi.fn();

// Create a mock db object
const mockDb = {
  // Mock Firestore instance
};

vi.mock("firebase/firestore", () => ({
  doc: (...args: any[]) => mockDoc(...args),
  getDoc: (...args: any[]) => mockGetDoc(...args),
  collection: (...args: any[]) => mockCollection(...args),
  getDocs: (...args: any[]) => mockGetDocs(...args),
  query: (...args: any[]) => mockQuery(...args),
  where: (...args: any[]) => mockWhere(...args),
  Timestamp: {
    now: () => ({
      seconds: Math.floor(Date.now() / 1000),
      nanoseconds: 0,
    }),
  },
}));

// Mock the config to return our mock db
vi.mock("../config", () => {
  const mockDb = {};
  return {
    db: mockDb,
  };
});

describe("Course Firestore Operations", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should throw error when db is not initialized", async () => {
    // Temporarily set db to null
    const originalDb = (await import("../config")).db;
    (await import("../config")).db = null as any;

    await expect(getCourse("test-id")).rejects.toThrow(
      "Firestore not initialized"
    );

    // Restore
    (await import("../config")).db = originalDb;
  });

  it("should get a course by ID", async () => {
    const testCourse: Course = {
      id: "test-course-1",
      subjectId: "mathematics",
      title: "Test Mathematics Course",
      description: "A test course",
      icon: "calculator",
      level: 1,
      estimatedDuration: 120,
      prerequisites: [],
      modules: [],
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const mockDocRef = {};
    const mockDocSnap = {
      exists: () => true,
      id: "test-course-1",
      data: () => testCourse,
    };

    mockDoc.mockReturnValue(mockDocRef);
    mockGetDoc.mockResolvedValue(mockDocSnap);

    const result = await getCourse("test-course-1");

    expect(mockDoc).toHaveBeenCalledWith(mockDb, "courses", "test-course-1");
    expect(mockGetDoc).toHaveBeenCalledWith(mockDocRef);
    expect(result).not.toBeNull();
    expect(result?.id).toBe("test-course-1");
    expect(result?.title).toBe("Test Mathematics Course");
    expect(result?.subjectId).toBe("mathematics");
  });

  it("should return null for non-existent course", async () => {
    const mockDocRef = {};
    const mockDocSnap = {
      exists: () => false,
      id: "non-existent",
      data: () => null,
    };

    mockDoc.mockReturnValue(mockDocRef);
    mockGetDoc.mockResolvedValue(mockDocSnap);

    const result = await getCourse("non-existent-course");

    expect(result).toBeNull();
  });

  it("should get courses by subject", async () => {
    const mathCourse1: Course = {
      id: "math-course-1",
      subjectId: "mathematics",
      title: "Math Course 1",
      description: "First math course",
      icon: "calculator",
      level: 1,
      estimatedDuration: 60,
      prerequisites: [],
      modules: [],
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const mathCourse2: Course = {
      id: "math-course-2",
      subjectId: "mathematics",
      title: "Math Course 2",
      description: "Second math course",
      icon: "calculator",
      level: 2,
      estimatedDuration: 90,
      prerequisites: [],
      modules: [],
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const mockQueryRef = {};
    const mockDocs = [
      { id: "math-course-1", data: () => mathCourse1 },
      { id: "math-course-2", data: () => mathCourse2 },
    ];

    const mockQuerySnapshot = {
      docs: mockDocs,
    };

    mockCollection.mockReturnValue({});
    mockWhere.mockReturnValue({});
    mockQuery.mockReturnValue(mockQueryRef);
    mockGetDocs.mockResolvedValue(mockQuerySnapshot);

    const results = await getCoursesBySubject("mathematics");

    expect(mockCollection).toHaveBeenCalledWith(mockDb, "courses");
    expect(mockWhere).toHaveBeenCalledWith("subjectId", "==", "mathematics");
    expect(results.length).toBe(2);
    expect(results.every((c) => c.subjectId === "mathematics")).toBe(true);
    expect(results.map((c) => c.id)).toContain("math-course-1");
    expect(results.map((c) => c.id)).toContain("math-course-2");
  });

  it("should get all courses", async () => {
    const course1: Course = {
      id: "all-course-1",
      subjectId: "mathematics",
      title: "Course 1",
      description: "Description",
      icon: "calculator",
      level: 1,
      estimatedDuration: 60,
      prerequisites: [],
      modules: [],
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const course2: Course = {
      id: "all-course-2",
      subjectId: "english",
      title: "Course 2",
      description: "Description",
      icon: "book-open",
      level: 1,
      estimatedDuration: 60,
      prerequisites: [],
      modules: [],
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const mockDocs = [
      { id: "all-course-1", data: () => course1 },
      { id: "all-course-2", data: () => course2 },
    ];

    const mockQuerySnapshot = {
      docs: mockDocs,
    };

    mockCollection.mockReturnValue({});
    mockGetDocs.mockResolvedValue(mockQuerySnapshot);

    const results = await getAllCourses();

    expect(mockCollection).toHaveBeenCalledWith(mockDb, "courses");
    expect(results.length).toBe(2);
    expect(results.map((c) => c.id)).toContain("all-course-1");
    expect(results.map((c) => c.id)).toContain("all-course-2");
  });

  it("should get a module from a course", async () => {
    const testModule = {
      id: "test-module-1",
      title: "Test Module",
      description: "Module description",
      order: 1,
      lessons: [],
    };

    const testCourse: Course = {
      id: "module-course-1",
      subjectId: "mathematics",
      title: "Course with Module",
      description: "Description",
      icon: "calculator",
      level: 1,
      estimatedDuration: 60,
      prerequisites: [],
      modules: [testModule],
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const mockDocRef = {};
    const mockDocSnap = {
      exists: () => true,
      id: "module-course-1",
      data: () => testCourse,
    };

    mockDoc.mockReturnValue(mockDocRef);
    mockGetDoc.mockResolvedValue(mockDocSnap);

    const result = await getModule("module-course-1", "test-module-1");

    expect(result).not.toBeNull();
    expect(result?.id).toBe("test-module-1");
    expect(result?.title).toBe("Test Module");
  });

  it("should return null for non-existent module", async () => {
    const testCourse: Course = {
      id: "module-course-1",
      subjectId: "mathematics",
      title: "Course with Module",
      description: "Description",
      icon: "calculator",
      level: 1,
      estimatedDuration: 60,
      prerequisites: [],
      modules: [],
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const mockDocRef = {};
    const mockDocSnap = {
      exists: () => true,
      id: "module-course-1",
      data: () => testCourse,
    };

    mockDoc.mockReturnValue(mockDocRef);
    mockGetDoc.mockResolvedValue(mockDocSnap);

    const result = await getModule("module-course-1", "non-existent-module");

    expect(result).toBeNull();
  });

  it("should get a lesson from a module", async () => {
    const testLesson = {
      id: "test-lesson-1",
      type: "video" as const,
      title: "Test Lesson",
      description: "Lesson description",
      duration: 10,
      order: 1,
      content: {
        videoUrl: "https://example.com/video.mp4",
        transcript: "Transcript",
        duration: 600,
      },
      embeddedQuestions: [],
      comprehensionCheck: [],
    };

    const testModule = {
      id: "lesson-module-1",
      title: "Module with Lesson",
      description: "Description",
      order: 1,
      lessons: [testLesson],
    };

    const testCourse: Course = {
      id: "lesson-course-1",
      subjectId: "mathematics",
      title: "Course with Lesson",
      description: "Description",
      icon: "calculator",
      level: 1,
      estimatedDuration: 60,
      prerequisites: [],
      modules: [testModule],
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const mockDocRef = {};
    const mockDocSnap = {
      exists: () => true,
      id: "lesson-course-1",
      data: () => testCourse,
    };

    mockDoc.mockReturnValue(mockDocRef);
    mockGetDoc.mockResolvedValue(mockDocSnap);

    const result = await getLesson(
      "lesson-course-1",
      "lesson-module-1",
      "test-lesson-1"
    );

    expect(result).not.toBeNull();
    expect(result?.id).toBe("test-lesson-1");
    expect(result?.title).toBe("Test Lesson");
    expect(result?.type).toBe("video");
  });

  it("should return null for non-existent lesson", async () => {
    const testModule = {
      id: "lesson-module-1",
      title: "Module with Lesson",
      description: "Description",
      order: 1,
      lessons: [],
    };

    const testCourse: Course = {
      id: "lesson-course-1",
      subjectId: "mathematics",
      title: "Course with Lesson",
      description: "Description",
      icon: "calculator",
      level: 1,
      estimatedDuration: 60,
      prerequisites: [],
      modules: [testModule],
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const mockDocRef = {};
    const mockDocSnap = {
      exists: () => true,
      id: "lesson-course-1",
      data: () => testCourse,
    };

    mockDoc.mockReturnValue(mockDocRef);
    mockGetDoc.mockResolvedValue(mockDocSnap);

    const result = await getLesson(
      "lesson-course-1",
      "lesson-module-1",
      "non-existent-lesson"
    );

    expect(result).toBeNull();
  });
});
