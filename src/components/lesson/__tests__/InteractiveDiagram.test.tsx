import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { InteractiveDiagram } from "../InteractiveDiagram";
import type { Hotspot } from "@/types/course";

const mockHotspots: Hotspot[] = [
  {
    id: "hotspot-1",
    x: 25,
    y: 30,
    title: "Point A",
    description: "This is point A",
  },
  {
    id: "hotspot-2",
    x: 75,
    y: 70,
    title: "Point B",
    description: "This is point B",
  },
];

describe("InteractiveDiagram", () => {
  it("should render image with caption", () => {
    render(
      <InteractiveDiagram
        imageUrl="https://example.com/diagram.png"
        caption="Test diagram"
      />
    );

    const img = screen.getByAltText("Test diagram");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "https://example.com/diagram.png");
    expect(screen.getByText("Test diagram")).toBeInTheDocument();
  });

  it("should render hotspots", () => {
    render(
      <InteractiveDiagram
        imageUrl="https://example.com/diagram.png"
        hotspots={mockHotspots}
      />
    );

    const hotspot1 = screen.getByLabelText("Point A");
    const hotspot2 = screen.getByLabelText("Point B");

    expect(hotspot1).toBeInTheDocument();
    expect(hotspot2).toBeInTheDocument();
  });

  it("should show tooltip when hotspot is clicked", async () => {
    const user = userEvent.setup();
    render(
      <InteractiveDiagram
        imageUrl="https://example.com/diagram.png"
        hotspots={mockHotspots}
      />
    );

    const hotspot = screen.getByLabelText("Point A");
    await user.click(hotspot);

    // Check for tooltip content (not sr-only text)
    const tooltip = screen.getByText("This is point A");
    expect(tooltip).toBeInTheDocument();
    expect(tooltip.closest("div")).toHaveClass("absolute");
  });

  it("should hide tooltip when hotspot is clicked again", async () => {
    const user = userEvent.setup();
    render(
      <InteractiveDiagram
        imageUrl="https://example.com/diagram.png"
        hotspots={mockHotspots}
      />
    );

    const hotspot = screen.getByLabelText("Point A");
    await user.click(hotspot);
    await user.click(hotspot);

    // Tooltip should be hidden (check for tooltip description, not sr-only)
    expect(screen.queryByText("This is point A")).not.toBeInTheDocument();
  });
});

