"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface DualCodedLayoutProps {
  leftContent: ReactNode;
  rightContent: ReactNode;
  className?: string;
}

export function DualCodedLayout({
  leftContent,
  rightContent,
  className = "",
}: DualCodedLayoutProps) {
  return (
    <div className={cn("grid grid-cols-1 lg:grid-cols-2 gap-6", className)}>
      {/* Text content - left side on desktop, top on mobile */}
      <div className="order-1 lg:order-1">{leftContent}</div>

      {/* Visual content - right side on desktop, bottom on mobile */}
      <div className="order-2 lg:order-2">{rightContent}</div>
    </div>
  );
}

