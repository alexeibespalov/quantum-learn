import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ChatBubble } from "../ChatBubble";
import { TutorConfig } from "@/types/course";

describe("ChatBubble", () => {
  const mockTutorConfig: TutorConfig = {
    persona: "Test Persona",
    systemPrompt: "Test Prompt",
    successCriteria: [],
    dynamicAssets: [
      {
        id: "asset-1",
        trigger: "test",
        type: "image",
        prompt: "Test Image",
        altText: "Test Alt Text",
      },
    ],
  };

  it("renders user message correctly", () => {
    render(<ChatBubble role="user" content="Hello AI" />);
    const textElement = screen.getByText("Hello AI");
    // The text is likely inside a <p> inside a prose <div> inside the bubble <div>
    // We search up to find the bubble container which should have the background class
    const bubble = textElement.closest(".bg-primary-600");
    expect(bubble).toBeInTheDocument();
  });

  it("renders assistant message correctly", () => {
    render(<ChatBubble role="assistant" content="Hello Student" />);
    expect(screen.getByText("Hello Student")).toBeInTheDocument();
  });

  it("renders dynamic asset when marker is present", () => {
    const content = "Here is an image: [DYNAMIC_ASSET:asset-1:image]";
    render(
      <ChatBubble
        role="assistant"
        content={content}
        tutorConfig={mockTutorConfig}
      />
    );

    expect(screen.getByText("Here is an image:")).toBeInTheDocument();
    expect(screen.getByText("Test Alt Text")).toBeInTheDocument();
    expect(screen.getByText("[Nano Banana Generation Mock]")).toBeInTheDocument();
  });

  it("ignores invalid asset markers", () => {
    const content = "Here is a missing image: [DYNAMIC_ASSET:missing-asset:image]";
    render(
      <ChatBubble
        role="assistant"
        content={content}
        tutorConfig={mockTutorConfig}
      />
    );

    expect(screen.getByText("Here is a missing image:")).toBeInTheDocument();
    expect(screen.queryByText("Test Alt Text")).not.toBeInTheDocument();
  });
});
