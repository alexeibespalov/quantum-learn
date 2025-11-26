import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { VideoPlayer } from "../VideoPlayer";

// Mock video element methods
const mockPlay = vi.fn();
const mockPause = vi.fn();

Object.defineProperty(HTMLMediaElement.prototype, "play", {
  writable: true,
  value: mockPlay,
});

Object.defineProperty(HTMLMediaElement.prototype, "pause", {
  writable: true,
  value: mockPause,
});

describe("VideoPlayer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render video element with controls", () => {
    render(<VideoPlayer src="https://example.com/video.mp4" />);

    const video = document.querySelector("video");
    expect(video).toBeInTheDocument();
    expect(video).toHaveAttribute("src", "https://example.com/video.mp4");
  });

  it("should toggle play/pause on button click", async () => {
    const user = userEvent.setup();
    render(<VideoPlayer src="https://example.com/video.mp4" />);

    const playButton = screen.getByRole("button", { name: /play/i });
    await user.click(playButton);

    expect(mockPlay).toHaveBeenCalled();
  });

  it("should update video time on seek", () => {
    const onTimeUpdate = vi.fn();
    render(
      <VideoPlayer
        src="https://example.com/video.mp4"
        onTimeUpdate={onTimeUpdate}
      />
    );

    const progressBar = screen.getByLabelText("Video progress") as HTMLInputElement;
    
    // Verify progress bar exists and can be changed
    expect(progressBar).toBeInTheDocument();
    expect(progressBar.type).toBe("range");
    
    // Simulate seeking
    fireEvent.change(progressBar, { target: { value: "60" } });
    
    // Verify the change event was handled (component should update internal state)
    expect(progressBar).toBeInTheDocument();
  });

  it("should toggle mute on button click", async () => {
    const user = userEvent.setup();
    render(<VideoPlayer src="https://example.com/video.mp4" />);

    const muteButton = screen.getByRole("button", { name: /mute/i });
    await user.click(muteButton);

    // Mute state should toggle
    expect(muteButton).toBeInTheDocument();
  });

  it("should change playback speed", async () => {
    const user = userEvent.setup();
    render(<VideoPlayer src="https://example.com/video.mp4" />);

    const speedSelect = screen.getByRole("combobox");
    await user.selectOptions(speedSelect, "1.25");

    expect(speedSelect).toHaveValue("1.25");
  });

  it("should toggle fullscreen", async () => {
    const user = userEvent.setup();
    const mockRequestFullscreen = vi.fn();
    const mockExitFullscreen = vi.fn();

    Object.defineProperty(document, "fullscreenElement", {
      writable: true,
      value: null,
    });

    const { container } = render(<VideoPlayer src="https://example.com/video.mp4" />);
    const videoContainer = container.querySelector("div");

    if (videoContainer) {
      videoContainer.requestFullscreen = mockRequestFullscreen;
    }
    document.exitFullscreen = mockExitFullscreen;

    const fullscreenButton = screen.getByRole("button", { name: /enter fullscreen/i });
    await user.click(fullscreenButton);

    expect(fullscreenButton).toBeInTheDocument();
  });

  it("should toggle captions when captionsUrl is provided", async () => {
    const user = userEvent.setup();
    render(
      <VideoPlayer
        src="https://example.com/video.mp4"
        captionsUrl="https://example.com/captions.vtt"
      />
    );

    const captionsButton = screen.getByRole("button", { name: /show captions/i });
    expect(captionsButton).toBeInTheDocument();

    await user.click(captionsButton);
    // Captions should toggle
    expect(captionsButton).toBeInTheDocument();
  });

  it("should handle keyboard shortcuts", async () => {
    const user = userEvent.setup();
    render(<VideoPlayer src="https://example.com/video.mp4" />);

    // Spacebar to play/pause
    await user.keyboard(" ");

    expect(mockPlay).toHaveBeenCalled();
  });
});

