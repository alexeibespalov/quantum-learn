import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
import { db } from "./config";
import type { Course, Module, Lesson } from "@/types/course";
import type { SubjectId } from "@/types";

export async function getCourse(courseId: string): Promise<Course | null> {
  if (!db) {
    throw new Error("Firestore not initialized");
  }

  const courseRef = doc(db, "courses", courseId);
  const courseSnap = await getDoc(courseRef);

  if (courseSnap.exists()) {
    const data = courseSnap.data();
    return {
      ...data,
      id: courseSnap.id,
      createdAt: data.createdAt as Timestamp,
      updatedAt: data.updatedAt as Timestamp,
    } as Course;
  }

  return null;
}

export async function getCoursesBySubject(
  subjectId: SubjectId
): Promise<Course[]> {
  if (!db) {
    throw new Error("Firestore not initialized");
  }

  const coursesRef = collection(db, "courses");
  const q = query(coursesRef, where("subjectId", "==", subjectId));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
    createdAt: doc.data().createdAt as Timestamp,
    updatedAt: doc.data().updatedAt as Timestamp,
  })) as Course[];
}

export async function getAllCourses(): Promise<Course[]> {
  if (!db) {
    throw new Error("Firestore not initialized");
  }

  const coursesRef = collection(db, "courses");
  const querySnapshot = await getDocs(coursesRef);

  return querySnapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
    createdAt: doc.data().createdAt as Timestamp,
    updatedAt: doc.data().updatedAt as Timestamp,
  })) as Course[];
}

export async function getModule(
  courseId: string,
  moduleId: string
): Promise<Module | null> {
  const course = await getCourse(courseId);
  if (!course) {
    return null;
  }

  const module = course.modules.find((m) => m.id === moduleId);
  return module || null;
}

export async function getLesson(
  courseId: string,
  moduleId: string,
  lessonId: string
): Promise<Lesson | null> {
  const module = await getModule(courseId, moduleId);
  if (!module) {
    return null;
  }

  const lesson = module.lessons.find((l) => l.id === lessonId);
  return lesson || null;
}

export interface LessonWithContext {
  lesson: Lesson;
  courseId: string;
  moduleId: string;
}

export async function findLessonById(lessonId: string): Promise<LessonWithContext | null> {
  const courses = await getAllCourses();
  
  for (const course of courses) {
    for (const module of course.modules) {
      const lesson = module.lessons.find((l) => l.id === lessonId);
      if (lesson) {
        return {
          lesson,
          courseId: course.id,
          moduleId: module.id,
        };
      }
    }
  }
  
  return null;
}

