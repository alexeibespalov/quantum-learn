import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EmbeddedQuestionModal } from "../EmbeddedQuestion";
import type { EmbeddedQuestion } from "@/types/course";

const mockQuestion: EmbeddedQuestion = {
  id: "q1",
  timestamp: 30,
  question: "What is 2 + 2?",
  type: "multiple-choice",
  options: ["3", "4", "5", "6"],
  correctAnswer: 1,
  explanation: "2 + 2 equals 4",
  points: 10,
};

describe("EmbeddedQuestionModal", () => {
  it("should render question when open", () => {
    render(
      <EmbeddedQuestionModal
        question={mockQuestion}
        isOpen={true}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
      />
    );

    expect(screen.getByText("Check Your Understanding")).toBeInTheDocument();
    expect(screen.getByText("What is 2 + 2?")).toBeInTheDocument();
  });

  it("should not render when closed", () => {
    render(
      <EmbeddedQuestionModal
        question={mockQuestion}
        isOpen={false}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
      />
    );

    expect(screen.queryByText("Check Your Understanding")).not.toBeInTheDocument();
  });

  it("should allow selecting multiple choice answer", async () => {
    const user = userEvent.setup();
    render(
      <EmbeddedQuestionModal
        question={mockQuestion}
        isOpen={true}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
      />
    );

    const option = screen.getByText("4");
    await user.click(option);

    expect(option).toHaveClass("border-primary-500");
  });

  it("should show correct result after submission", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(
      <EmbeddedQuestionModal
        question={mockQuestion}
        isOpen={true}
        onClose={vi.fn()}
        onSubmit={onSubmit}
      />
    );

    const correctOption = screen.getByText("4");
    await user.click(correctOption);
    
    const submitButton = screen.getByText("Submit Answer");
    await user.click(submitButton);

    expect(screen.getByText("✓ Correct!")).toBeInTheDocument();
    expect(screen.getByText("2 + 2 equals 4")).toBeInTheDocument();
    expect(onSubmit).toHaveBeenCalledWith(1);
  });

  it("should show incorrect result after wrong submission", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(
      <EmbeddedQuestionModal
        question={mockQuestion}
        isOpen={true}
        onClose={vi.fn()}
        onSubmit={onSubmit}
      />
    );

    const wrongOption = screen.getByText("3");
    await user.click(wrongOption);
    
    const submitButton = screen.getByText("Submit Answer");
    await user.click(submitButton);

    expect(screen.getByText("✗ Incorrect")).toBeInTheDocument();
    expect(onSubmit).toHaveBeenCalledWith(0);
  });

  it("should handle true/false questions", async () => {
    const user = userEvent.setup();
    const trueFalseQuestion: EmbeddedQuestion = {
      ...mockQuestion,
      type: "true-false",
      correctAnswer: 0,
    };

    render(
      <EmbeddedQuestionModal
        question={trueFalseQuestion}
        isOpen={true}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
      />
    );

    const trueButton = screen.getByText("True");
    await user.click(trueButton);

    expect(trueButton).toHaveClass("border-primary-500");
  });

  it("should handle short answer questions", async () => {
    const user = userEvent.setup();
    const shortAnswerQuestion: EmbeddedQuestion = {
      ...mockQuestion,
      type: "short-answer",
      correctAnswer: "four",
    };

    render(
      <EmbeddedQuestionModal
        question={shortAnswerQuestion}
        isOpen={true}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
      />
    );

    const textarea = screen.getByPlaceholderText("Type your answer here...");
    await user.type(textarea, "four");

    expect(textarea).toHaveValue("four");
  });

  it("should call onClose when continue button is clicked", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <EmbeddedQuestionModal
        question={mockQuestion}
        isOpen={true}
        onClose={onClose}
        onSubmit={vi.fn()}
      />
    );

    const correctOption = screen.getByText("4");
    await user.click(correctOption);
    
    const submitButton = screen.getByText("Submit Answer");
    await user.click(submitButton);

    const continueButton = screen.getByText("Continue");
    await user.click(continueButton);

    expect(onClose).toHaveBeenCalled();
  });
});

