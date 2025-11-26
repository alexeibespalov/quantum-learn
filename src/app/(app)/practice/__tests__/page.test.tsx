import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import PracticePage from "../page";

// Mock Next.js navigation
vi.mock("next/navigation", () => ({
  useSearchParams: () => ({
    get: (key: string) => (key === "subjectId" ? "math" : "algebra"),
  }),
}));

// Mock Firebase functions
const mockHttpsCallable = vi.fn();
vi.mock("firebase/functions", () => ({
  getFunctions: vi.fn(),
  httpsCallable: (functions: any, name: string) => {
    return (data: any) => mockHttpsCallable(name, data);
  },
}));

// Mock Firebase config
vi.mock("@/lib/firebase/config", () => ({
  app: {},
  functions: {}, // Export mocked functions instance
}));

describe("PracticePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders initial state", () => {
    render(<PracticePage />);
    expect(screen.getByText("Practice Mode: algebra")).toBeInTheDocument();
    expect(screen.getByText("Start Practice Session")).toBeInTheDocument();
  });

  it("generates a question when clicking start", async () => {
    mockHttpsCallable.mockImplementation(async (name, data) => {
      if (name === "generateQuestion") {
        return {
          data: {
            questionText: "What is 2+2?",
            type: "multiple-choice",
            options: ["3", "4", "5"],
            correctAnswer: "4",
            explanation: "Math",
          },
        };
      }
    });

    render(<PracticePage />);
    fireEvent.click(screen.getByText("Start Practice Session"));

    expect(screen.getByText("Consulting the AI Examiner...")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("What is 2+2?")).toBeInTheDocument();
      expect(screen.getByText("3")).toBeInTheDocument();
      expect(screen.getByText("4")).toBeInTheDocument();
    });
  });

  it("evaluates an answer correctly", async () => {
    // Setup question state first by simulating generation
    mockHttpsCallable.mockImplementation(async (name, data) => {
      if (name === "generateQuestion") {
        return {
          data: {
            questionText: "What is 2+2?",
            type: "multiple-choice",
            options: ["3", "4", "5"],
            correctAnswer: "4",
            explanation: "Simple addition",
          },
        };
      }
      if (name === "evaluateAnswer") {
        return {
          data: {
            isCorrect: true,
            feedback: "Great job!",
            masteryAdjustment: 5,
          },
        };
      }
    });

    render(<PracticePage />);
    fireEvent.click(screen.getByText("Start Practice Session"));

    await waitFor(() => {
      expect(screen.getByText("What is 2+2?")).toBeInTheDocument();
    });

    // Select answer
    fireEvent.click(screen.getByText("4"));
    fireEvent.click(screen.getByText("Check Answer"));

    await waitFor(() => {
      expect(screen.getByText("Correct!")).toBeInTheDocument();
      expect(screen.getByText("Great job!")).toBeInTheDocument();
      expect(screen.getByText("Explanation:")).toBeInTheDocument();
      expect(screen.getByText("Simple addition")).toBeInTheDocument();
    });
  });
});
