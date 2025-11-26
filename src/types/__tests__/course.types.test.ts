import { describe, it, expect } from "vitest";
import type {
  Course,
  Module,
  Lesson,
  EmbeddedQuestion,
  ComprehensionCheck,
  VideoContent,
  TextContent,
  SimulationContent,
} from "../course";
import { Timestamp } from "firebase/firestore";

describe("Course Types", () => {
  describe("EmbeddedQuestion", () => {
    it("should validate multiple-choice question structure", () => {
      const question: EmbeddedQuestion = {
        id: "q1",
        timestamp: 120,
        question: "What is 2 + 2?",
        type: "multiple-choice",
        options: ["3", "4", "5", "6"],
        correctAnswer: 1,
        explanation: "2 + 2 equals 4",
        points: 10,
      };

      expect(question.type).toBe("multiple-choice");
      expect(question.options).toBeDefined();
      expect(question.options?.length).toBe(4);
      expect(typeof question.correctAnswer).toBe("number");
    });

    it("should validate true-false question structure", () => {
      const question: EmbeddedQuestion = {
        id: "q2",
        timestamp: 180,
        question: "The Earth is round",
        type: "true-false",
        correctAnswer: 0, // 0 = false, 1 = true
        explanation: "The Earth is approximately spherical",
        points: 5,
      };

      expect(question.type).toBe("true-false");
      expect(typeof question.correctAnswer).toBe("number");
    });

    it("should validate short-answer question structure", () => {
      const question: EmbeddedQuestion = {
        id: "q3",
        timestamp: 240,
        question: "What is the capital of France?",
        type: "short-answer",
        correctAnswer: "Paris",
        explanation: "Paris is the capital and largest city of France",
        points: 10,
      };

      expect(question.type).toBe("short-answer");
      expect(typeof question.correctAnswer).toBe("string");
    });
  });

  describe("ComprehensionCheck", () => {
    it("should validate comprehension check structure", () => {
      const check: ComprehensionCheck = {
        id: "cc1",
        question: "What did you learn in this lesson?",
        type: "multiple-choice",
        options: ["Option A", "Option B", "Option C", "Option D"],
        correctAnswer: 2,
        explanation: "This is the correct answer",
        points: 15,
      };

      expect(check.id).toBeDefined();
      expect(check.question).toBeDefined();
      expect(check.explanation).toBeDefined();
      expect(check.points).toBeGreaterThan(0);
    });
  });

  describe("VideoContent", () => {
    it("should validate video content structure", () => {
      const content: VideoContent = {
        videoUrl: "https://example.com/video.mp4",
        transcript: "This is a transcript...",
        duration: 600,
        captionsUrl: "https://example.com/captions.vtt",
        thumbnailUrl: "https://example.com/thumb.jpg",
      };

      expect(content.videoUrl).toBeDefined();
      expect(content.transcript).toBeDefined();
      expect(content.duration).toBeGreaterThan(0);
    });
  });

  describe("TextContent", () => {
    it("should validate text content structure", () => {
      const content: TextContent = {
        markdown: "# Lesson Title\n\nContent here...",
        sections: [
          {
            id: "sec1",
            title: "Introduction",
            content: "Introduction content",
            order: 1,
          },
        ],
        visuals: [],
      };

      expect(content.markdown).toBeDefined();
      expect(Array.isArray(content.sections)).toBe(true);
      expect(content.sections.length).toBeGreaterThan(0);
    });
  });

  describe("SimulationContent", () => {
    it("should validate simulation content structure", () => {
      const content: SimulationContent = {
        type: "phet",
        embedUrl: "https://phet.colorado.edu/sims/...",
        instructions: "Follow these steps...",
        objectives: ["Objective 1", "Objective 2"],
      };

      expect(content.type).toBe("phet");
      expect(content.instructions).toBeDefined();
      expect(Array.isArray(content.objectives)).toBe(true);
    });
  });

  describe("Lesson", () => {
    it("should validate video lesson structure", () => {
      const videoContent: VideoContent = {
        videoUrl: "https://example.com/video.mp4",
        transcript: "Transcript",
        duration: 600,
      };

      const lesson: Lesson = {
        id: "lesson1",
        type: "video",
        title: "Introduction to Algebra",
        description: "Learn the basics",
        duration: 10,
        order: 1,
        content: videoContent,
        embeddedQuestions: [],
        comprehensionCheck: [],
      };

      expect(lesson.type).toBe("video");
      expect(lesson.content).toHaveProperty("videoUrl");
      expect(lesson.content).toHaveProperty("transcript");
    });

    it("should validate text lesson structure", () => {
      const textContent: TextContent = {
        markdown: "# Content",
        sections: [
          {
            id: "sec1",
            title: "Section 1",
            content: "Content",
            order: 1,
          },
        ],
      };

      const lesson: Lesson = {
        id: "lesson2",
        type: "text",
        title: "Reading Lesson",
        description: "Read and learn",
        duration: 15,
        order: 2,
        content: textContent,
        embeddedQuestions: [],
        comprehensionCheck: [],
      };

      expect(lesson.type).toBe("text");
      expect(lesson.content).toHaveProperty("markdown");
      expect(lesson.content).toHaveProperty("sections");
    });

    it("should validate simulation lesson structure", () => {
      const simContent: SimulationContent = {
        type: "phet",
        embedUrl: "https://phet.colorado.edu/...",
        instructions: "Instructions",
        objectives: ["Obj1"],
      };

      const lesson: Lesson = {
        id: "lesson3",
        type: "simulation",
        title: "Physics Simulation",
        description: "Interactive learning",
        duration: 20,
        order: 3,
        content: simContent,
        embeddedQuestions: [],
        comprehensionCheck: [],
      };

      expect(lesson.type).toBe("simulation");
      expect(lesson.content).toHaveProperty("type");
      expect(lesson.content).toHaveProperty("instructions");
    });
  });

  describe("Module", () => {
    it("should validate module structure", () => {
      const module: Module = {
        id: "mod1",
        title: "Module 1: Foundations",
        description: "Basic concepts",
        order: 1,
        lessons: [],
      };

      expect(module.id).toBeDefined();
      expect(module.title).toBeDefined();
      expect(module.order).toBeGreaterThanOrEqual(0);
      expect(Array.isArray(module.lessons)).toBe(true);
    });
  });

  describe("Course", () => {
    it("should validate course structure", () => {
      const course: Course = {
        id: "course1",
        subjectId: "mathematics",
        title: "Mathematics Fundamentals",
        description: "Learn math basics",
        icon: "calculator",
        level: 1,
        estimatedDuration: 120,
        prerequisites: [],
        modules: [],
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      expect(course.id).toBeDefined();
      expect(course.subjectId).toBe("mathematics");
      expect(course.level).toBeGreaterThanOrEqual(1);
      expect(course.level).toBeLessThanOrEqual(5);
      expect(course.estimatedDuration).toBeGreaterThan(0);
      expect(Array.isArray(course.modules)).toBe(true);
      expect(course.createdAt).toBeInstanceOf(Timestamp);
      expect(course.updatedAt).toBeInstanceOf(Timestamp);
    });

    it("should validate course with prerequisites", () => {
      const course: Course = {
        id: "course2",
        subjectId: "mathematics",
        title: "Advanced Mathematics",
        description: "Advanced topics",
        icon: "calculator",
        level: 3,
        estimatedDuration: 180,
        prerequisites: ["course1"],
        modules: [],
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      expect(Array.isArray(course.prerequisites)).toBe(true);
      expect(course.prerequisites.length).toBeGreaterThan(0);
    });
  });
});

