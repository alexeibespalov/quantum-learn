import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useProgress } from "../useProgress";
import { useAuth } from "@/context/AuthContext";
import * as progressLib from "@/lib/firebase/progress";
import { Timestamp } from "firebase/firestore";
import type { UserCourseProgress } from "@/types/progress";

// Mock the auth context
vi.mock("@/context/AuthContext", () => ({
  useAuth: vi.fn(),
}));

// Mock progress functions
vi.mock("@/lib/firebase/progress", () => ({
  getUserProgress: vi.fn(),
  updateLessonProgress: vi.fn(),
  markLessonComplete: vi.fn(),
  saveVideoPosition: vi.fn(),
  getResumePosition: vi.fn(),
}));

describe("useProgress", () => {
  const mockUser = {
    uid: "user123",
    email: "test@example.com",
  };

  const mockProgress: UserCourseProgress = {
    userId: "user123",
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

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAuth).mockReturnValue({
      user: mockUser,
      loading: false,
    } as any);
  });

  it("should load progress on mount", async () => {
    vi.mocked(progressLib.getUserProgress).mockResolvedValue(mockProgress);

    const { result } = renderHook(() =>
      useProgress({ courseId: "course1" })
    );

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.progress).toEqual(mockProgress);
    expect(progressLib.getUserProgress).toHaveBeenCalledWith(
      "user123",
      "course1"
    );
  });

  it("should handle loading error", async () => {
    const error = new Error("Failed to load");
    vi.mocked(progressLib.getUserProgress).mockRejectedValue(error);

    const { result } = renderHook(() =>
      useProgress({ courseId: "course1" })
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe(error);
    expect(result.current.progress).toBeNull();
  });

  it("should update progress optimistically", async () => {
    const updatedProgress: UserCourseProgress = {
      ...mockProgress,
      lessonProgress: {
        lesson1: {
          status: "in_progress",
          startedAt: Timestamp.now(),
          timeSpent: 300,
          lastPosition: 0,
          attempts: 1,
        },
      },
    };

    vi.mocked(progressLib.getUserProgress)
      .mockResolvedValueOnce(mockProgress)
      .mockResolvedValueOnce(updatedProgress);
    vi.mocked(progressLib.updateLessonProgress).mockResolvedValue(undefined);

    const { result } = renderHook(() =>
      useProgress({ courseId: "course1" })
    );

    await waitFor(() => {
      expect(result.current.progress).not.toBeNull();
    });

    await result.current.updateProgress("lesson1", {
      status: "in_progress",
      timeSpent: 300,
    }, true);

    await waitFor(() => {
      expect(result.current.progress?.lessonProgress["lesson1"]?.status).toBe(
        "in_progress"
      );
    });

    expect(progressLib.updateLessonProgress).toHaveBeenCalled();
  });

  it("should complete lesson", async () => {
    const completedProgress: UserCourseProgress = {
      ...mockProgress,
      lessonProgress: {
        lesson1: {
          status: "completed",
          startedAt: Timestamp.now(),
          completedAt: Timestamp.now(),
          timeSpent: 600,
          lastPosition: 600,
          score: 85,
          attempts: 1,
        },
      },
    };

    vi.mocked(progressLib.getUserProgress)
      .mockResolvedValueOnce(mockProgress)
      .mockResolvedValueOnce(completedProgress);
    vi.mocked(progressLib.markLessonComplete).mockResolvedValue(undefined);

    const { result } = renderHook(() =>
      useProgress({ courseId: "course1" })
    );

    await waitFor(() => {
      expect(result.current.progress).not.toBeNull();
    });

    await result.current.completeLesson("lesson1", 85);

    await waitFor(() => {
      expect(result.current.progress?.lessonProgress["lesson1"]?.status).toBe(
        "completed"
      );
    });

    expect(result.current.progress?.lessonProgress["lesson1"]?.score).toBe(85);
    expect(progressLib.markLessonComplete).toHaveBeenCalledWith(
      "user123",
      "course1",
      "lesson1",
      85
    );
  });

  it("should save video position", async () => {
    vi.mocked(progressLib.getUserProgress).mockResolvedValue(mockProgress);

    const { result } = renderHook(() =>
      useProgress({ courseId: "course1" })
    );

    await waitFor(() => {
      expect(result.current.progress).not.toBeNull();
    });

    result.current.savePosition("lesson1", 120);

    await waitFor(() => {
      expect(result.current.progress?.lessonProgress["lesson1"]?.lastPosition).toBe(
        120
      );
    });
  });

  it("should get resume position", async () => {
    const progressWithPosition: UserCourseProgress = {
      ...mockProgress,
      lessonProgress: {
        lesson1: {
          status: "in_progress",
          startedAt: Timestamp.now(),
          timeSpent: 300,
          lastPosition: 120,
          attempts: 1,
        },
      },
    };

    vi.mocked(progressLib.getUserProgress).mockResolvedValue(progressWithPosition);
    vi.mocked(progressLib.getResumePosition).mockResolvedValue(120);

    const { result } = renderHook(() =>
      useProgress({ courseId: "course1" })
    );

    await waitFor(() => {
      expect(result.current.progress).not.toBeNull();
    });

    const position = await result.current.getResumePosition("lesson1");

    expect(position).toBe(120);
  });

  it("should not load progress if user is not authenticated", async () => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      loading: false,
    } as any);

    const { result } = renderHook(() =>
      useProgress({ courseId: "course1" })
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(progressLib.getUserProgress).not.toHaveBeenCalled();
    expect(result.current.progress).toBeNull();
  });
});

