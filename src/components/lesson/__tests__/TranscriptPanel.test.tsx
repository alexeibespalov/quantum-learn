import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TranscriptPanel } from "../TranscriptPanel";

const mockTranscript = `0:00 Welcome to this lesson on mathematics.
0:05 Today we'll be learning about algebra.
0:10 Algebra is a branch of mathematics.`;

describe("TranscriptPanel", () => {
  it("should render transcript segments", () => {
    render(
      <TranscriptPanel
        transcript={mockTranscript}
        currentTime={0}
      />
    );

    expect(screen.getByText("Transcript")).toBeInTheDocument();
    expect(screen.getByText(/Welcome to this lesson/)).toBeInTheDocument();
  });

  it("should highlight active segment based on current time", () => {
    const { rerender } = render(
      <TranscriptPanel
        transcript={mockTranscript}
        currentTime={2}
      />
    );

    // First segment should be active
    const firstSegment = screen.getByText(/Welcome to this lesson/).closest("div");
    expect(firstSegment).toHaveClass("bg-primary-50");

    // Move to second segment
    rerender(
      <TranscriptPanel
        transcript={mockTranscript}
        currentTime={7}
      />
    );

    const secondSegment = screen.getByText(/Today we'll be learning/).closest("div");
    expect(secondSegment).toHaveClass("bg-primary-50");
  });

  it("should call onSeek when segment is clicked", async () => {
    const user = userEvent.setup();
    const onSeek = vi.fn();

    render(
      <TranscriptPanel
        transcript={mockTranscript}
        currentTime={0}
        onSeek={onSeek}
      />
    );

    const segment = screen.getByText(/Today we'll be learning/).closest("div");
    if (segment) {
      await user.click(segment);
      expect(onSeek).toHaveBeenCalled();
    }
  });

  it("should parse transcript without timestamps", () => {
    const simpleTranscript = `First line of transcript.
Second line of transcript.
Third line of transcript.`;

    render(
      <TranscriptPanel
        transcript={simpleTranscript}
        currentTime={0}
      />
    );

    expect(screen.getByText("First line of transcript.")).toBeInTheDocument();
    expect(screen.getByText("Second line of transcript.")).toBeInTheDocument();
  });
});

