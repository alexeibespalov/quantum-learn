import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SubjectCard } from "../SubjectCard";
import type { SubjectWithProgress } from "@/services/subjects";

describe("SubjectCard", () => {
  const mockSubject: SubjectWithProgress = {
    id: "mathematics",
    name: "Mathematics",
    icon: "calculator",
    progress: 42,
    level: 3,
    courses: [],
    totalCourses: 1,
    completedCourses: 0,
  };

  it("should render subject icon, title, and subtitle", () => {
    render(<SubjectCard subject={mockSubject} />);

    expect(screen.getByText("Mathematics")).toBeInTheDocument();
    expect(screen.getByText("Year 9 • Key Stage 3")).toBeInTheDocument();
  });

  it("should display progress ring with correct percentage", () => {
    render(<SubjectCard subject={mockSubject} />);

    expect(screen.getByText("42%")).toBeInTheDocument();
    const progressBar = screen.getByRole("link").querySelector(".h-2");
    expect(progressBar).toBeInTheDocument();
  });

  it("should show Start button when progress is 0", () => {
    const subjectNoProgress = { ...mockSubject, progress: 0 };
    render(<SubjectCard subject={subjectNoProgress} />);

    expect(screen.getByText("Start")).toBeInTheDocument();
  });

  it("should show Continue button when progress > 0", () => {
    render(<SubjectCard subject={mockSubject} />);

    expect(screen.getByText("Continue")).toBeInTheDocument();
  });

  it("should link to correct subject detail page", () => {
    render(<SubjectCard subject={mockSubject} />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/subjects/mathematics");
  });
});

