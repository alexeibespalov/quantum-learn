import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MarkdownRenderer } from "../MarkdownRenderer";

describe("MarkdownRenderer", () => {
  it("should render markdown content", () => {
    const content = "# Heading\n\nThis is a paragraph.";
    render(<MarkdownRenderer content={content} />);

    expect(screen.getByText("Heading")).toBeInTheDocument();
    expect(screen.getByText("This is a paragraph.")).toBeInTheDocument();
  });

  it("should render LaTeX math expressions", () => {
    const content = "The quadratic formula is $x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}$";
    render(<MarkdownRenderer content={content} />);

    // KaTeX should render the math
    expect(screen.getByText(/quadratic formula/i)).toBeInTheDocument();
  });

  it("should render code blocks with syntax highlighting", () => {
    const content = "```javascript\nconst x = 5;\n```";
    render(<MarkdownRenderer content={content} />);

    // Syntax highlighting breaks up the text, so check for parts
    expect(screen.getByText("const")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("should render inline code", () => {
    const content = "Use `console.log()` to print.";
    render(<MarkdownRenderer content={content} />);

    expect(screen.getByText("console.log()")).toBeInTheDocument();
  });

  it("should render lists", () => {
    const content = "- Item 1\n- Item 2\n- Item 3";
    render(<MarkdownRenderer content={content} />);

    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText("Item 2")).toBeInTheDocument();
    expect(screen.getByText("Item 3")).toBeInTheDocument();
  });

  it("should render links", () => {
    const content = "[Link text](https://example.com)";
    render(<MarkdownRenderer content={content} />);

    const link = screen.getByText("Link text");
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "https://example.com");
  });
});

