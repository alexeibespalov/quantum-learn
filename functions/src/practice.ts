import { genkit, z } from "genkit";
import { googleAI } from "@genkit-ai/google-genai";
import { onCallGenkit } from "firebase-functions/https";
import { defineSecret } from "firebase-functions/params";

const apiKey = defineSecret("GOOGLE_GENAI_API_KEY");

const ai = genkit({
  plugins: [googleAI()],
});

// --- Schemas ---

// Input for generating a question
const GenerateQuestionInput = z.object({
  subjectId: z.string(), // e.g., "mathematics"
  topic: z.string(), // e.g., "BODMAS" or "Algebraic Equations"
  difficulty: z.number().min(1).max(5), // 1 = Beginner, 5 = Challenge
  previousMistakes: z.array(z.string()).optional(), // Context to generate targeted questions
});

// Output for the question (Structured JSON)
const GeneratedQuestionSchema = z.object({
  questionText: z.string(),
  type: z.enum(["multiple-choice", "short-answer"]),
  options: z.array(z.string()).optional(), // Only for multiple-choice
  correctAnswer: z.string(), // The hidden answer
  hint: z.string().optional(),
  explanation: z.string(), // To be shown AFTER answering
});

// Input for evaluating an answer
const EvaluateAnswerInput = z.object({
  question: z.string(),
  userAnswer: z.string(),
  correctAnswer: z.string(),
  subjectId: z.string(),
});

// Output for evaluation
const EvaluationResultSchema = z.object({
  isCorrect: z.boolean(),
  feedback: z.string(), // Conversational explanation
  masteryAdjustment: z.number(), // Suggest how much to bump mastery (e.g., +5, -2)
});

// --- Flows ---

export const generateQuestionFlow = ai.defineFlow(
  {
    name: "generateQuestionFlow",
    inputSchema: GenerateQuestionInput,
    outputSchema: GeneratedQuestionSchema,
  },
  async (input) => {
    const { subjectId, topic, difficulty, previousMistakes } = input;

    const prompt = `
      You are an expert exam setter for Year 9 UK Curriculum ${subjectId}.
      Generate a SINGLE practice question for the topic: "${topic}".
      Difficulty Level: ${difficulty}/5.
      
      ${
        previousMistakes?.length
          ? `The student previously made these mistakes: ${previousMistakes.join(
              ", "
            )}. Create a question that tests if they have overcome this.`
          : ""
      }

      Return PURE JSON matching this schema:
      {
        "questionText": "The actual question string",
        "type": "multiple-choice" (or "short-answer" if math/calculation),
        "options": ["A", "B", "C", "D"] (if multiple-choice),
        "correctAnswer": "The exact correct string",
        "hint": "A subtle nudge",
        "explanation": "A clear, educational explanation of why the answer is correct."
      }
    `;

    const { output } = await ai.generate({
      model: googleAI.model("gemini-2.5-flash"),
      prompt: prompt,
      output: { format: "json", schema: GeneratedQuestionSchema },
    });

    if (!output) {
      throw new Error("Failed to generate question");
    }

    return output;
  }
);

export const evaluateAnswerFlow = ai.defineFlow(
  {
    name: "evaluateAnswerFlow",
    inputSchema: EvaluateAnswerInput,
    outputSchema: EvaluationResultSchema,
  },
  async (input) => {
    const { question, userAnswer, correctAnswer, subjectId } = input;

    const prompt = `
      You are a supportive tutor. A student answered a ${subjectId} question.
      Question: "${question}"
      Correct Answer: "${correctAnswer}"
      Student Answer: "${userAnswer}"

      Evaluate if the student is correct. 
      - For Math, accept equivalent forms (e.g. 0.5 == 1/2).
      - For Text, be lenient with spelling if the concept is right.
      
      Provide "feedback" that acts as a short tutor comment. 
      If wrong, explain the misconception gently. 
      If right, give a brief affirmation.

      Return JSON:
      {
        "isCorrect": boolean,
        "feedback": "string",
        "masteryAdjustment": number (between -10 and 10)
      }
    `;

    const { output } = await ai.generate({
      model: googleAI.model("gemini-2.5-flash"),
      prompt: prompt,
      output: { format: "json", schema: EvaluationResultSchema },
    });

    if (!output) {
      throw new Error("Failed to evaluate answer");
    }

    return output;
  }
);

// Export callables
export const generateQuestion = onCallGenkit({ secrets: [apiKey] }, generateQuestionFlow);
export const evaluateAnswer = onCallGenkit({ secrets: [apiKey] }, evaluateAnswerFlow);
