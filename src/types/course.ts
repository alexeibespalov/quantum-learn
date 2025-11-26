import { Timestamp } from "firebase/firestore";
import { SubjectId } from "./index";

export type LessonType = "video" | "text" | "simulation" | "chat";

export interface EmbeddedQuestion {
  id: string;
  timestamp: number; // For video lessons: seconds into video
  question: string;
  type: "multiple-choice" | "true-false" | "short-answer";
  options?: string[]; // Required for multiple-choice
  correctAnswer: string | number; // String for short-answer, number (index) for multiple-choice/true-false
  explanation: string;
  points: number;
}

export interface ComprehensionCheck {
  id: string;
  question: string;
  type: "multiple-choice" | "true-false" | "short-answer";
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
  points: number;
}

export interface VideoContent {
  videoUrl: string;
  veoPrompt?: string; // Prompt to generate video if url is missing
  transcript: string;
  captionsUrl?: string;
  duration: number; // seconds
  thumbnailUrl?: string;
}

export interface TextContent {
  markdown: string;
  sections: TextSection[];
  visuals?: VisualContent[];
}

export interface TextSection {
  id: string;
  title: string;
  content: string; // Markdown content
  order: number;
}

export interface VisualContent {
  id: string;
  type: "image" | "diagram" | "interactive";
  url: string;
  caption?: string;
  sectionId?: string; // Links to specific section
  hotspots?: Hotspot[];
}

export interface Hotspot {
  id: string;
  x: number; // Percentage (0-100)
  y: number; // Percentage (0-100)
  title: string;
  description: string;
}

export interface SimulationContent {
  type: "phet" | "custom";
  embedUrl?: string;
  componentName?: string;
  instructions: string;
  objectives: string[];
}

export interface DynamicAsset {
  id: string;
  trigger: string; // Context/keyword that suggests using this asset
  type: "image" | "video" | "graph";
  prompt: string; // The specific prompt for the tool (Nano Banana / Veo)
  altText: string;
}

export interface TutorConfig {
  persona: string; // e.g., "Socratic", "Direct", "Playful"
  systemPrompt: string; // The core instruction for the LLM
  successCriteria: string[]; // What the student must demonstrate to "pass"
  dynamicAssets?: DynamicAsset[]; // Assets the AI can generate
}

export interface ChatContent {
  openingMessage: string;
  tutorConfig: TutorConfig;
}

export interface Lesson {
  id: string;
  type: LessonType;
  title: string;
  description: string;
  duration: number; // minutes
  order: number;
  content: VideoContent | TextContent | SimulationContent | ChatContent;
  embeddedQuestions: EmbeddedQuestion[];
  comprehensionCheck: ComprehensionCheck[];
  prerequisites?: string[]; // Lesson IDs that must be completed first
}

export interface Module {
  id: string;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
  prerequisites?: string[]; // Module IDs that must be completed first
}

export interface Course {
  id: string;
  subjectId: SubjectId;
  title: string;
  description: string;
  icon: string;
  level: 1 | 2 | 3 | 4 | 5;
  estimatedDuration: number; // minutes
  prerequisites: string[]; // Course IDs that must be completed first
  modules: Module[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

