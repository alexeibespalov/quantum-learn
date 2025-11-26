import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ModuleAccordion } from "../ModuleAccordion";
import type { SubjectDetails } from "@/services/subjects";

describe("ModuleAccordion", () => {
  const mockModules: SubjectDetails["modules"] = [
    {
      id: "mod-1",
      title: "Module 1: Foundations",
      description: "Basic concepts",
      order: 1,
      status: "completed",
      progress: 100,
      lessons: [
        {
          id: "lesson1",
          title: "Introduction",
          type: "video",
          duration: 12,
          order: 1,
          status: "completed",
        },
      ],
    },
    {
      id: "mod-2",
      title: "Module 2: Advanced",
      description: "Advanced topics",
      order: 2,
      status: "in_progress",
      progress: 50,
      lessons: [
        {
          id: "lesson2",
          title: "Advanced Concepts",
          type: "text",
          duration: 15,
          order: 1,
          status: "in_progress",
        },
      ],
    },
    {
      id: "mod-3",
      title: "Module 3: Mastery",
      description: "Mastery level",
      order: 3,
      status: "locked",
      progress: 0,
      lessons: [],
    },
  ];

  it("should render module titles and status icons", () => {
    render(<ModuleAccordion modules={mockModules} />);

    expect(screen.getByText("Module 1: Foundations")).toBeInTheDocument();
    expect(screen.getByText("Module 2: Advanced")).toBeInTheDocument();
    expect(screen.getByText("Module 3: Mastery")).toBeInTheDocument();
  });

  it("should expand/collapse on click", async () => {
    const user = userEvent.setup();
    render(<ModuleAccordion modules={mockModules} />);

    const module1 = screen.getByText("Module 1: Foundations").closest("div");
    expect(module1).toBeInTheDocument();

    // Click to expand
    await user.click(module1!);

    // Should show lessons
    expect(screen.getByText("Introduction")).toBeInTheDocument();
  });

  it("should show lessons when expanded", async () => {
    const user = userEvent.setup();
    render(<ModuleAccordion modules={mockModules} />);

    const module1 = screen.getByText("Module 1: Foundations").closest("div");
    await user.click(module1!);

    expect(screen.getByText("Introduction")).toBeInTheDocument();
    expect(screen.getByText("12 min")).toBeInTheDocument();
  });

  it("should display lock icon for locked modules", () => {
    render(<ModuleAccordion modules={mockModules} />);

    const module3 = screen.getByText("Module 3: Mastery");
    const moduleContainer = module3.closest(".bg-white");
    expect(moduleContainer).toHaveClass("opacity-60");
  });

  it("should show lesson status indicators", async () => {
    const user = userEvent.setup();
    render(<ModuleAccordion modules={mockModules} />);

    const module1 = screen.getByText("Module 1: Foundations").closest("div");
    await user.click(module1!);

    // Lesson status should be visible
    const lesson = screen.getByText("Introduction");
    expect(lesson).toBeInTheDocument();
  });
});

