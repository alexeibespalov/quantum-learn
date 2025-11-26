import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ComprehensionQuiz } from "../ComprehensionQuiz";
import type { ComprehensionCheck } from "@/types/course";

const mockQuestions: ComprehensionCheck[] = [
  {
    id: "q1",
    question: "What is 2 + 2?",
    type: "multiple-choice",
    options: ["3", "4", "5"],
    correctAnswer: 1,
    explanation: "2 + 2 equals 4",
    points: 10,
  },
  {
    id: "q2",
    question: "Is 5 greater than 3?",
    type: "true-false",
    correctAnswer: 0,
    explanation: "Yes, 5 is greater than 3",
    points: 5,
  },
];

describe("ComprehensionQuiz", () => {
  it("should render first question", () => {
    render(
      <ComprehensionQuiz
        questions={mockQuestions}
        onComplete={vi.fn()}
      />
    );

    expect(screen.getByText("Comprehension Check")).toBeInTheDocument();
    expect(screen.getByText("What is 2 + 2?")).toBeInTheDocument();
    expect(screen.getByText("Question 1 of 2")).toBeInTheDocument();
  });

  it("should allow selecting answers", async () => {
    const user = userEvent.setup();
    render(
      <ComprehensionQuiz
        questions={mockQuestions}
        onComplete={vi.fn()}
      />
    );

    const option = screen.getByText("4");
    await user.click(option);

    expect(option.closest("button")).toHaveClass("border-primary-500");
  });

  it("should navigate to next question", async () => {
    const user = userEvent.setup();
    render(
      <ComprehensionQuiz
        questions={mockQuestions}
        onComplete={vi.fn()}
      />
    );

    const option = screen.getByText("4");
    await user.click(option);

    const nextButton = screen.getByText("Next");
    await user.click(nextButton);

    expect(screen.getByText("Is 5 greater than 3?")).toBeInTheDocument();
    expect(screen.getByText("Question 2 of 2")).toBeInTheDocument();
  });

  it("should show results after completing all questions", async () => {
    const user = userEvent.setup();
    const onComplete = vi.fn();
    render(
      <ComprehensionQuiz
        questions={mockQuestions}
        onComplete={onComplete}
      />
    );

    // Answer first question
    const option1 = screen.getByText("4");
    await user.click(option1);
    await user.click(screen.getByText("Next"));

    // Answer second question
    const trueButton = screen.getByText("True");
    await user.click(trueButton);
    await user.click(screen.getByText("Submit Quiz"));

    expect(screen.getByText("Quiz Complete!")).toBeInTheDocument();
    expect(onComplete).toHaveBeenCalled();
  });

  it("should calculate score correctly", async () => {
    const user = userEvent.setup();
    const onComplete = vi.fn();
    render(
      <ComprehensionQuiz
        questions={mockQuestions}
        onComplete={onComplete}
      />
    );

    // Answer first question correctly
    const option1 = screen.getByText("4");
    await user.click(option1);
    await user.click(screen.getByText("Next"));

    // Answer second question correctly
    const trueButton = screen.getByText("True");
    await user.click(trueButton);
    await user.click(screen.getByText("Submit Quiz"));

    expect(onComplete).toHaveBeenCalledWith(15, 15); // 10 + 5 = 15
  });

  it("should allow going back to previous question", async () => {
    const user = userEvent.setup();
    render(
      <ComprehensionQuiz
        questions={mockQuestions}
        onComplete={vi.fn()}
      />
    );

    const option1 = screen.getByText("4");
    await user.click(option1);
    await user.click(screen.getByText("Next"));

    const previousButton = screen.getByText("Previous");
    await user.click(previousButton);

    expect(screen.getByText("What is 2 + 2?")).toBeInTheDocument();
  });
});

