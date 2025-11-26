import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { DynamicAssetCard } from "../DynamicAssetCard";
import { DynamicAsset } from "@/types/course";

describe("DynamicAssetCard", () => {
  it("renders an image asset", () => {
    const asset: DynamicAsset = {
      id: "1",
      trigger: "test",
      type: "image",
      prompt: "Test Prompt",
      altText: "Test Image Alt",
    };
    render(<DynamicAssetCard asset={asset} />);
    expect(screen.getByText("Test Image Alt")).toBeInTheDocument();
    expect(screen.getByText("[Nano Banana Generation Mock]")).toBeInTheDocument();
    expect(screen.getByText(/Prompt: Test Prompt/)).toBeInTheDocument();
  });

  it("renders a video asset", () => {
    const asset: DynamicAsset = {
      id: "2",
      trigger: "test",
      type: "video",
      prompt: "Test Video Prompt",
      altText: "Test Video Alt",
    };
    render(<DynamicAssetCard asset={asset} />);
    expect(screen.getByText("Test Video Alt")).toBeInTheDocument();
    expect(screen.getByText("[Veo Generation Mock]")).toBeInTheDocument();
  });

  it("renders a graph asset using GraphCard", () => {
    const asset: DynamicAsset = {
      id: "3",
      trigger: "test",
      type: "graph",
      prompt: "y=2x+1",
      altText: "Test Graph",
    };
    
    // Since DynamicAssetCard imports GraphCard, we can mock it to verify it's called
    // But for a simple integration test, we can just check if the graph title appears
    render(<DynamicAssetCard asset={asset} />);
    expect(screen.getByText("Test Graph")).toBeInTheDocument();
    expect(screen.getByText("Graph of y=2x+1")).toBeInTheDocument();
  });
});
