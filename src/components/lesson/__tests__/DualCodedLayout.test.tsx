import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { DualCodedLayout } from "../DualCodedLayout";

describe("DualCodedLayout", () => {
  it("should render left and right content", () => {
    render(
      <DualCodedLayout
        leftContent={<div>Left Content</div>}
        rightContent={<div>Right Content</div>}
      />
    );

    expect(screen.getByText("Left Content")).toBeInTheDocument();
    expect(screen.getByText("Right Content")).toBeInTheDocument();
  });

  it("should apply custom className", () => {
    const { container } = render(
      <DualCodedLayout
        leftContent={<div>Left</div>}
        rightContent={<div>Right</div>}
        className="custom-class"
      />
    );

    const layout = container.firstChild;
    expect(layout).toHaveClass("custom-class");
  });

  it("should stack content on mobile and split on desktop", () => {
    const { container } = render(
      <DualCodedLayout
        leftContent={<div>Left</div>}
        rightContent={<div>Right</div>}
      />
    );

    const layout = container.firstChild;
    expect(layout).toHaveClass("grid-cols-1");
    expect(layout).toHaveClass("lg:grid-cols-2");
  });
});

