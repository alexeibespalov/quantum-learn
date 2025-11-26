import React from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { cn } from "@/lib/utils";
import { DynamicAsset, TutorConfig } from "@/types/course";
import { DynamicAssetCard } from "./DynamicAssetCard";
import "katex/dist/katex.min.css";

interface ChatBubbleProps {
  role: "user" | "assistant" | "system";
  content: string;
  tutorConfig?: TutorConfig;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({
  role,
  content,
  tutorConfig,
}) => {
  // Parse content for [DYNAMIC_ASSET:id:type]
  const parts = content.split(/(\[DYNAMIC_ASSET:[^\]]+\])/g);

  return (
    <div
      className={cn(
        "flex w-full",
        role === "user" ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-5 py-4 shadow-sm",
          role === "user"
            ? "bg-primary text-primary-foreground rounded-br-sm"
            : "bg-card border border-border rounded-bl-sm"
        )}
      >
        {parts.map((part, index) => {
          const match = part.match(/\[DYNAMIC_ASSET:([^:]+):([^\]]+)\]/);
          if (match) {
            const assetId = match[1];
            const asset = tutorConfig?.dynamicAssets?.find(
              (a) => a.id === assetId
            );
            if (asset) {
              return <DynamicAssetCard key={index} asset={asset} />;
            }
            return null;
          }

          if (!part.trim()) return null;

          return (
            <div
              key={index}
              className={cn(
                "prose prose-sm max-w-none",
                role === "user"
                  ? "prose-invert"
                  : "prose-invert prose-headings:text-card-foreground prose-p:text-card-foreground prose-strong:text-card-foreground prose-code:text-card-foreground prose-pre:text-card-foreground prose-li:text-card-foreground prose-a:text-primary hover:prose-a:text-primary/80"
              )}
            >
              <ReactMarkdown
                remarkPlugins={[remarkMath]}
                rehypePlugins={[rehypeKatex]}
              >
                {part}
              </ReactMarkdown>
            </div>
          );
        })}
      </div>
    </div>
  );
};
