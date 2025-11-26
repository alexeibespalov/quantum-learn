import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  getUserProgress,
  updateLessonProgress,
  markLessonComplete,
  saveVideoPosition,
  getResumePosition,
} from "@/lib/firebase/progress";
import type { UserCourseProgress, LessonProgress } from "@/types/progress";

interface UseProgressOptions {
  courseId: string;
  autoSaveInterval?: number; // milliseconds, default 30000 (30 seconds)
}

export function useProgress({ courseId, autoSaveInterval = 30000 }: UseProgressOptions) {
  const { user } = useAuth();
  const [progress, setProgress] = useState<UserCourseProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pendingUpdatesRef = useRef<Map<string, Partial<LessonProgress>>>(new Map());

  // Load progress on mount
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    loadProgress();
  }, [user, courseId]);

  // Auto-save pending updates
  useEffect(() => {
    if (!user || !progress) {
      return;
    }

    // Clear existing timer
    if (autoSaveTimerRef.current) {
      clearInterval(autoSaveTimerRef.current);
    }

    // Set up auto-save interval
    autoSaveTimerRef.current = setInterval(() => {
      savePendingUpdates();
    }, autoSaveInterval);

    return () => {
      if (autoSaveTimerRef.current) {
        clearInterval(autoSaveTimerRef.current);
      }
    };
  }, [user, progress, autoSaveInterval]);

  const loadProgress = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      const userProgress = await getUserProgress(user.uid, courseId);
      setProgress(userProgress);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to load progress"));
    } finally {
      setLoading(false);
    }
  }, [user, courseId]);

  const savePendingUpdates = useCallback(async () => {
    if (!user || !progress || pendingUpdatesRef.current.size === 0) {
      return;
    }

    const updates = Array.from(pendingUpdatesRef.current.entries());
    pendingUpdatesRef.current.clear();

    for (const [lessonId, lessonUpdates] of updates) {
      try {
        await updateLessonProgress(user.uid, courseId, lessonId, lessonUpdates);
      } catch (err) {
        console.error(`Failed to save progress for lesson ${lessonId}:`, err);
        // Re-add failed update to pending
        pendingUpdatesRef.current.set(lessonId, lessonUpdates);
      }
    }

    // Reload progress after saving
    await loadProgress();
  }, [user, courseId, progress, loadProgress]);

  const updateProgress = useCallback(
    async (lessonId: string, updates: Partial<LessonProgress>, immediate = false) => {
      if (!user || !progress) {
        return;
      }

      // Optimistic update
      setProgress((prev) => {
        if (!prev) return prev;

        const updatedLessonProgress = {
          ...prev.lessonProgress[lessonId],
          ...updates,
        };

        return {
          ...prev,
          lessonProgress: {
            ...prev.lessonProgress,
            [lessonId]: updatedLessonProgress as LessonProgress,
          },
        };
      });

      if (immediate) {
        // Save immediately
        try {
          await updateLessonProgress(user.uid, courseId, lessonId, updates);
          await loadProgress(); // Reload to get server state
        } catch (err) {
          setError(err instanceof Error ? err : new Error("Failed to update progress"));
          // Revert optimistic update on error
          await loadProgress();
        }
      } else {
        // Queue for auto-save
        const existingUpdates = pendingUpdatesRef.current.get(lessonId) || {};
        pendingUpdatesRef.current.set(lessonId, {
          ...existingUpdates,
          ...updates,
        });
      }
    },
    [user, courseId, progress, loadProgress]
  );

  const completeLesson = useCallback(
    async (lessonId: string, score: number) => {
      if (!user) return;

      // Optimistic update
      setProgress((prev) => {
        if (!prev) return prev;

        const updatedLessonProgress: LessonProgress = {
          ...prev.lessonProgress[lessonId],
          status: "completed",
          completedAt: new Date() as any, // Will be replaced by server
          score: Math.max(0, Math.min(100, score)),
        };

        return {
          ...prev,
          lessonProgress: {
            ...prev.lessonProgress,
            [lessonId]: updatedLessonProgress,
          },
        };
      });

      try {
        await markLessonComplete(user.uid, courseId, lessonId, score);
        await loadProgress(); // Reload to get server state
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to complete lesson"));
        await loadProgress(); // Revert on error
      }
    },
    [user, courseId, loadProgress]
  );

  const savePosition = useCallback(
    async (lessonId: string, position: number) => {
      if (!user) return;

      // Optimistic update
      setProgress((prev) => {
        if (!prev) return prev;

        const updatedLessonProgress = {
          ...prev.lessonProgress[lessonId],
          lastPosition: position,
          status: "in_progress" as const,
        };

        return {
          ...prev,
          lessonProgress: {
            ...prev.lessonProgress,
            [lessonId]: updatedLessonProgress as LessonProgress,
          },
        };
      });

      // Queue for auto-save (don't save immediately for position updates)
      const existingUpdates = pendingUpdatesRef.current.get(lessonId) || {};
      pendingUpdatesRef.current.set(lessonId, {
        ...existingUpdates,
        lastPosition: position,
        status: "in_progress",
      });
    },
    [user, progress]
  );

  const getResumePositionForLesson = useCallback(
    async (lessonId: string): Promise<number> => {
      if (!user) return 0;

      if (progress?.lessonProgress[lessonId]?.lastPosition) {
        return progress.lessonProgress[lessonId].lastPosition;
      }

      try {
        return await getResumePosition(user.uid, courseId, lessonId);
      } catch (err) {
        console.error("Failed to get resume position:", err);
        return 0;
      }
    },
    [user, courseId, progress]
  );

  return {
    progress,
    loading,
    error,
    updateProgress,
    completeLesson,
    savePosition,
    getResumePosition: getResumePositionForLesson,
    refresh: loadProgress,
  };
}

