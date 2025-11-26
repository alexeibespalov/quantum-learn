import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SectionNav } from "../SectionNav";
import type { TextSection } from "@/types/course";

const mockSections: TextSection[] = [
  {
    id: "section-1",
    title: "Introduction",
    content: "Content 1",
    order: 1,
  },
  {
    id: "section-2",
    title: "Main Content",
    content: "Content 2",
    order: 2,
  },
  {
    id: "section-3",
    title: "Conclusion",
    content: "Content 3",
    order: 3,
  },
];

describe("SectionNav", () => {
  it("should render all sections", () => {
    render(
      <SectionNav
        sections={mockSections}
        activeSectionId="section-1"
        onSectionChange={vi.fn()}
      />
    );

    expect(screen.getByText("Sections")).toBeInTheDocument();
    expect(screen.getByText("Introduction")).toBeInTheDocument();
    expect(screen.getByText("Main Content")).toBeInTheDocument();
    expect(screen.getByText("Conclusion")).toBeInTheDocument();
  });

  it("should highlight active section", () => {
    render(
      <SectionNav
        sections={mockSections}
        activeSectionId="section-2"
        onSectionChange={vi.fn()}
      />
    );

    const activeSection = screen.getByText("Main Content").closest("button");
    expect(activeSection).toHaveClass("bg-primary-50");
  });

  it("should call onSectionChange when section is clicked", async () => {
    const user = userEvent.setup();
    const onSectionChange = vi.fn();

    render(
      <SectionNav
        sections={mockSections}
        activeSectionId="section-1"
        onSectionChange={onSectionChange}
      />
    );

    const sectionButton = screen.getByText("Main Content");
    await user.click(sectionButton);

    expect(onSectionChange).toHaveBeenCalledWith("section-2");
  });

  it("should handle keyboard navigation", async () => {
    const user = userEvent.setup();
    const onSectionChange = vi.fn();

    render(
      <SectionNav
        sections={mockSections}
        activeSectionId="section-1"
        onSectionChange={onSectionChange}
      />
    );

    await user.keyboard("{ArrowDown}");

    expect(onSectionChange).toHaveBeenCalledWith("section-2");
  });
});

