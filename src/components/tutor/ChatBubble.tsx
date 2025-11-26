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
            ? "bg-primary-600 text-white rounded-br-sm"
            : "bg-white text-gray-900 border border-gray-100 rounded-bl-sm"
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
                role === "user" ? "prose-invert" : "prose-slate"
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
