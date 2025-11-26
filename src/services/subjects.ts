import { getCoursesBySubject, getAllCourses } from "@/lib/firebase/courses";
import { getUserProgress, calculateCourseProgress } from "@/lib/firebase/progress";
import { SUBJECTS, type SubjectId } from "@/types";
import type { Course } from "@/types/course";
import type { UserCourseProgress } from "@/types/progress";

export interface SubjectWithProgress {
  id: SubjectId;
  name: string;
  icon: string;
  progress: number; // 0-100
  level: number; // 1-5
  courses: Course[];
  totalCourses: number;
  completedCourses: number;
}

export interface SubjectDetails extends SubjectWithProgress {
  modules: Array<{
    id: string;
    title: string;
    description: string;
    order: number;
    status: "locked" | "available" | "in_progress" | "completed";
    progress: number; // 0-100
    lessons: Array<{
      id: string;
      title: string;
      type: "video" | "text" | "simulation" | "chat";
      duration: number;
      order: number;
      status: "not_started" | "in_progress" | "completed";
    }>;
  }>;
}

export type SubjectFilter = "all" | "in-progress" | "not-started";

export async function getSubjectsWithProgress(
  userId: string
): Promise<SubjectWithProgress[]> {
  const allCourses = await getAllCourses();
  const subjectsMap = new Map<SubjectId, SubjectWithProgress>();

  // Initialize all subjects
  SUBJECTS.forEach((subject) => {
    subjectsMap.set(subject.id, {
      id: subject.id,
      name: subject.name,
      icon: subject.icon,
      progress: 0,
      level: 1,
      courses: [],
      totalCourses: 0,
      completedCourses: 0,
    });
  });

  // Group courses by subject
  allCourses.forEach((course) => {
    const subject = subjectsMap.get(course.subjectId);
    if (subject) {
      subject.courses.push(course);
      subject.totalCourses++;
    }
  });

  // Calculate progress for each subject
  for (const [subjectId, subject] of subjectsMap.entries()) {
    if (subject.courses.length === 0) {
      continue;
    }

    let totalProgress = 0;
    let completedCount = 0;

    for (const course of subject.courses) {
      try {
        const progress = await getUserProgress(userId, course.id);
        if (progress) {
          const courseProgress = progress.courseProgress.overallPercentage;
          totalProgress += courseProgress;
          if (courseProgress === 100) {
            completedCount++;
          }
        }
      } catch (error) {
        console.error(`Failed to get progress for course ${course.id}:`, error);
      }
    }

    subject.progress = subject.courses.length > 0
      ? totalProgress / subject.courses.length
      : 0;
    subject.completedCourses = completedCount;

    // Calculate level based on progress
    if (subject.progress >= 90) {
      subject.level = 5;
    } else if (subject.progress >= 70) {
      subject.level = 4;
    } else if (subject.progress >= 50) {
      subject.level = 3;
    } else if (subject.progress >= 30) {
      subject.level = 2;
    } else {
      subject.level = 1;
    }
  }

  return Array.from(subjectsMap.values());
}

export async function getSubjectDetails(
  subjectId: SubjectId,
  userId: string
): Promise<SubjectDetails | null> {
  const subject = SUBJECTS.find((s) => s.id === subjectId);
  if (!subject) {
    return null;
  }

  const courses = await getCoursesBySubject(subjectId);
  if (courses.length === 0) {
    return {
      id: subject.id,
      name: subject.name,
      icon: subject.icon,
      progress: 0,
      level: 1,
      courses: [],
      totalCourses: 0,
      completedCourses: 0,
      modules: [],
    };
  }

  // Get progress for all courses in this subject
  const coursesWithProgress = await Promise.all(
    courses.map(async (course) => {
      const progress = await getUserProgress(userId, course.id);
      return { course, progress };
    })
  );

  // Aggregate modules and lessons from all courses
  const modulesMap = new Map<string, SubjectDetails["modules"][0]>();
  let totalProgress = 0;
  let completedCount = 0;

  coursesWithProgress.forEach(({ course, progress }) => {
    if (progress) {
      totalProgress += progress.courseProgress.overallPercentage;
      if (progress.courseProgress.overallPercentage === 100) {
        completedCount++;
      }
    }

    course.modules.forEach((module) => {
      const moduleProgress = progress?.moduleProgress[module.id];
      const moduleStatus = moduleProgress?.status || "locked";
      const moduleProgressPercent = moduleProgress
        ? (moduleProgress.completedLessons / moduleProgress.totalLessons) * 100
        : 0;

      const lessons = module.lessons.map((lesson) => {
        const lessonProgress = progress?.lessonProgress[lesson.id];
        const lessonStatus = lessonProgress?.status || "not_started";

        return {
          id: lesson.id,
          title: lesson.title,
          type: lesson.type,
          duration: lesson.duration,
          order: lesson.order,
          status: lessonStatus,
        };
      });

      // Use module ID from course to avoid conflicts
      const moduleKey = `${course.id}-${module.id}`;
      if (!modulesMap.has(moduleKey)) {
        modulesMap.set(moduleKey, {
          id: module.id,
          title: module.title,
          description: module.description,
          order: module.order,
          status: moduleStatus as any,
          progress: moduleProgressPercent,
          lessons,
        });
      }
    });
  });

  const overallProgress = courses.length > 0 ? totalProgress / courses.length : 0;
  const level =
    overallProgress >= 90
      ? 5
      : overallProgress >= 70
      ? 4
      : overallProgress >= 50
      ? 3
      : overallProgress >= 30
      ? 2
      : 1;

  return {
    id: subject.id,
    name: subject.name,
    icon: subject.icon,
    progress: overallProgress,
    level,
    courses,
    totalCourses: courses.length,
    completedCourses: completedCount,
    modules: Array.from(modulesMap.values()).sort((a, b) => a.order - b.order),
  };
}

export function filterSubjectsByStatus(
  subjects: SubjectWithProgress[],
  filter: SubjectFilter
): SubjectWithProgress[] {
  switch (filter) {
    case "in-progress":
      return subjects.filter(
        (subject) => subject.progress > 0 && subject.progress < 100
      );
    case "not-started":
      return subjects.filter((subject) => subject.progress === 0);
    case "all":
    default:
      return subjects;
  }
}

