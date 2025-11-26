import { genkit, z } from "genkit";
import { googleAI } from "@genkit-ai/google-genai";
import { onCallGenkit } from "firebase-functions/https";
import { defineSecret } from "firebase-functions/params";

const apiKey = defineSecret("GOOGLE_GENAI_API_KEY");

const ai = genkit({
  plugins: [googleAI()],
});

// --- Schemas ---

const DynamicAssetSchema = z.object({
  id: z.string(),
  trigger: z.string(),
  type: z.enum(["image", "video", "graph"]),
  prompt: z.string(),
  altText: z.string(),
});

const TutorConfigSchema = z.object({
  persona: z.string(),
  systemPrompt: z.string(),
  successCriteria: z.array(z.string()),
  dynamicAssets: z.array(DynamicAssetSchema).optional(),
});

const StudentProfileSchema = z.object({
  displayName: z.string(),
  year: z.string().optional(),
});

// We expect the client to send the full history plus the new message
const MessagePartSchema = z.object({
  text: z.string().optional(),
  media: z.object({ url: z.string() }).optional(),
});

const MessageSchema = z.object({
  role: z.enum(["user", "model", "system"]),
  content: z.array(MessagePartSchema),
});

const TutorInputSchema = z.object({
  history: z.array(MessageSchema),
  tutorConfig: TutorConfigSchema,
  studentProfile: StudentProfileSchema,
  userMessage: z.string(),
});

const ToolOutputSchema = z.object({
  assetId: z.string(),
  type: z.enum(["image", "video", "graph"]),
  status: z.string(),
});

// --- Flow ---

export const tutorFlow = ai.defineFlow(
  {
    name: "tutorFlow",
    inputSchema: TutorInputSchema,
    outputSchema: z.string(), // The primary text response
    streamSchema: z.string(),
  },
  async (input, { sendChunk }) => {
    const { history, tutorConfig, studentProfile, userMessage } = input;

    // Construct the System Instruction
    const systemInstruction = `
    You are an AI Tutor for QuantumLearn.
**Student Profile:** Name: ${studentProfile.displayName}, Year: ${studentProfile.year || "9"}.
**Persona:** ${tutorConfig.persona}

**Instructions:**
${tutorConfig.systemPrompt}

**Success Criteria for this Lesson:**
${tutorConfig.successCriteria.map((c) => `- ${c}`).join("\n")}

**Dynamic Assets:**
You have access to a tool called 'triggerAsset'. Use it when you want to show a visual aid.
Available Assets:
${tutorConfig.dynamicAssets?.map((a) => `- ID: "${a.id}" (Trigger: ${a.trigger}) -> ${a.altText}`).join("\n") || "None"}

When the conversation context matches a 'Trigger', call the 'triggerAsset' tool with the corresponding ID.
Do not describe the image in text if you are showing it. Just say something like "Here is a diagram to help you."
`;

    // transform history to Genkit format if needed, or just append
    // For simplicity, we'll convert our simple input history to Genkit's Message format if strictly required,
    // but 'generate' usually takes a specific history format.
    // Let's assume 'history' passed from client aligns with what we want, or we reconstruct it.
    // We'll prepend the system prompt.

    const messages = [
      { role: "system", content: [{ text: systemInstruction }] },
      ...history.map((m) => ({
        role: m.role,
        content: m.content,
      })),
      { role: "user", content: [{ text: userMessage }] },
    ];

    // Define the Tool
    const triggerAssetTool = ai.defineTool(
      {
        name: "triggerAsset",
        description: "Triggers the display of a dynamic educational asset (image or video) to the student.",
        inputSchema: z.object({
          assetId: z.string().describe("The ID of the asset to trigger"),
        }),
        outputSchema: ToolOutputSchema,
      },
      async ({ assetId }) => {
        const asset = tutorConfig.dynamicAssets?.find((a) => a.id === assetId);
        if (!asset) {
          return { assetId, type: "image", status: "error: not found" };
        }
        // In a real system, we might generate the image URL here using Nano Banana API
        // For now, we return the instruction to the client to render it.
        // We'll send a special chunk or structured data?
        // Genkit streaming usually sends text chunks.
        // We can send a "tool call" chunk if the client supports it, or inject a special marker.

        // Hack for MVP streaming: We'll inject a Markdown-like marker that the client parses.
        const marker = `\n\n[DYNAMIC_ASSET:${assetId}:${asset.type}]\n\n`;
        sendChunk(marker);

        return { assetId, type: asset.type, status: "displayed" };
      }
    );

    const { response, stream } = ai.generateStream({
      model: googleAI.model("gemini-2.5-flash"),
      messages: messages as any, // Type assertion to bypass strict Genkit message checks for now
      tools: [triggerAssetTool],
      config: {
        temperature: 0.7,
      },
    });

    for await (const chunk of stream) {
      // We only send text chunks. Tool calls are handled automatically by Genkit loop,
      // but our tool implementation sends the "marker" chunk.
      // Normal text chunks:
      if (chunk.text) {
        sendChunk(chunk.text);
      }
    }

    return (await response).text;
  }
);

export const tutor = onCallGenkit({
  secrets: [apiKey],
}, tutorFlow);
