import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { GraphCard } from "../GraphCard";

// Mock Recharts to avoid complex SVG rendering issues in jsdom
vi.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  LineChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="line-chart">{children}</div>
  ),
  Line: () => <div data-testid="line" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  ReferenceLine: () => <div data-testid="reference-line" />,
}));

describe("GraphCard", () => {
  it("renders with title and equation", () => {
    render(<GraphCard equation="y=2x+1" title="Test Graph" />);
    expect(screen.getByText("Test Graph")).toBeInTheDocument();
    expect(screen.getByText("Graph of y=2x+1")).toBeInTheDocument();
  });

  it("renders chart components", () => {
    render(<GraphCard equation="y=x" />);
    expect(screen.getByTestId("responsive-container")).toBeInTheDocument();
    expect(screen.getByTestId("line-chart")).toBeInTheDocument();
  });

  // Note: Testing the internal parseEquation logic would ideally require exporting it
  // or testing the component's behavior if it displayed data points.
  // For this UI component test, checking that it renders without crashing is the baseline.
});
