"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { httpsCallable } from "firebase/functions";
import { functions } from "@/lib/firebase/config";
import { Button } from "@/components/ui/Button";
import { ArrowRight, CheckCircle, XCircle, BrainCircuit, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

// Types matching our Genkit schema
interface QuestionData {
  questionText: string;
  type: "multiple-choice" | "short-answer";
  options?: string[];
  correctAnswer: string;
  hint?: string;
  explanation: string;
}

interface EvaluationResult {
  isCorrect: boolean;
  feedback: string;
  masteryAdjustment: number;
}

export default function PracticePage() {
  const searchParams = useSearchParams();
  const subjectId = searchParams.get("subjectId") || "mathematics";
  const topic = searchParams.get("topic") || "General";

  const [question, setQuestion] = useState<QuestionData | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [textAnswer, setTextAnswer] = useState("");
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [difficulty, setDifficulty] = useState(2); // Start easy-ish

  const generateNewQuestion = async () => {
    setLoading(true);
    setQuestion(null);
    setEvaluation(null);
    setSelectedOption(null);
    setTextAnswer("");

    try {
      if (!functions) throw new Error("Functions not initialized");
      const generateFn = httpsCallable(functions, "generateQuestion");
      
      const result = await generateFn({
        subjectId,
        topic,
        difficulty,
        previousMistakes: [], // Could track this in state/context
      });

      setQuestion(result.data as QuestionData);
    } catch (err) {
      console.error("Failed to generate question", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!question) return;

    const userAnswer =
      question.type === "multiple-choice" ? selectedOption : textAnswer;

    if (!userAnswer) return;

    try {
      setLoading(true);
      if (!functions) throw new Error("Functions not initialized");
      const evaluateFn = httpsCallable(functions, "evaluateAnswer");

      const result = await evaluateFn({
        question: question.questionText,
        userAnswer,
        correctAnswer: question.correctAnswer,
        subjectId,
      });

      setEvaluation(result.data as EvaluationResult);
      
      // Adaptive Difficulty Logic
      const evalData = result.data as EvaluationResult;
      if (evalData.isCorrect && difficulty < 5) {
        setDifficulty((d) => d + 1);
      } else if (!evalData.isCorrect && difficulty > 1) {
        setDifficulty((d) => d - 1);
      }

      // In a real app, we'd verify with the backend (gamification) here
      if (evalData.isCorrect) {
        // triggerXPUpdate(+20); 
      }

    } catch (err) {
      console.error("Evaluation failed", err);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  if (!question && !loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] max-w-2xl mx-auto text-center px-4">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
          <BrainCircuit className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Practice Mode: {topic}
        </h1>
        <p className="text-muted-foreground mb-8">
          The AI will generate infinite unique questions adapting to your skill level.
        </p>
        <Button onClick={generateNewQuestion} size="lg" className="w-full sm:w-auto">
          Start Practice Session
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-lg font-semibold text-foreground capitalize">{subjectId} Practice</h2>
          <p className="text-sm text-muted-foreground">Topic: {topic} • Level {difficulty}</p>
        </div>
        <Button variant="outline" onClick={() => window.history.back()}>
          Exit
        </Button>
      </div>

      {/* Loading State */}
      {loading && !evaluation && (
        <div className="flex flex-col items-center justify-center py-20 animate-pulse">
          <RefreshCw className="w-8 h-8 text-primary animate-spin mb-4" />
          <p className="text-muted-foreground">Consulting the AI Examiner...</p>
        </div>
      )}

      {/* Question Card */}
      {question && (
        <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
          <div className="p-6 md:p-8">
            <h3 className="text-xl font-medium text-card-foreground mb-8">
              {question.questionText}
            </h3>

            {/* Inputs */}
            <div className="space-y-4">
              {question.type === "multiple-choice" ? (
                <div className="grid gap-3">
                  {question.options?.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => !evaluation && setSelectedOption(opt)}
                      disabled={!!evaluation}
                      className={cn(
                        "w-full text-left px-6 py-4 rounded-xl border transition-all",
                        selectedOption === opt
                          ? "border-primary bg-primary/10 text-primary ring-1 ring-primary"
                          : "border-border hover:border-primary/50 hover:bg-accent/5 text-foreground",
                        evaluation && "opacity-60 cursor-not-allowed"
                      )}
                    >
                      <span className="inline-block w-6 font-medium text-muted-foreground mr-2">
                        {String.fromCharCode(65 + idx)}.
                      </span>
                      {opt}
                    </button>
                  ))}
                </div>
              ) : (
                <input
                  type="text"
                  value={textAnswer}
                  onChange={(e) => setTextAnswer(e.target.value)}
                  disabled={!!evaluation}
                  placeholder="Type your answer..."
                  className="w-full px-6 py-4 text-lg border border-input bg-input/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-muted-foreground"
                />
              )}
            </div>
          </div>

          {/* Footer Actions */}
          {!evaluation && (
            <div className="p-6 bg-muted/20 border-t border-border flex justify-end">
              <Button
                onClick={handleSubmit}
                disabled={
                  loading ||
                  (question.type === "multiple-choice" && !selectedOption) ||
                  (question.type === "short-answer" && !textAnswer.trim())
                }
                size="lg"
              >
                Check Answer
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Evaluation Result */}
      {evaluation && (
        <div className={cn(
          "mt-6 rounded-2xl p-6 border animate-in slide-in-from-bottom-4 fade-in duration-500",
          evaluation.isCorrect 
            ? "bg-green-500/10 border-green-500/30" 
            : "bg-destructive/10 border-destructive/30"
        )}>
          <div className="flex items-start gap-4">
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
              evaluation.isCorrect ? "bg-green-500/20 text-green-500" : "bg-destructive/20 text-destructive"
            )}>
              {evaluation.isCorrect ? <CheckCircle className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
            </div>
            <div className="flex-1">
              <h4 className={cn(
                "text-lg font-bold mb-1",
                evaluation.isCorrect ? "text-green-500" : "text-destructive"
              )}>
                {evaluation.isCorrect ? "Correct!" : "Not quite..."}
              </h4>
              <p className={cn(
                "text-sm mb-4 leading-relaxed",
                evaluation.isCorrect ? "text-green-200" : "text-destructive-foreground"
              )}>
                {evaluation.feedback}
              </p>
              
              {/* Explanation Accordion (always show for learning) */}
              <div className="bg-background/50 rounded-lg p-4 text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">Explanation: </span>
                {question?.explanation}
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <Button onClick={generateNewQuestion} size="lg" className={cn(
              evaluation.isCorrect ? "bg-green-600 hover:bg-green-700" : "bg-primary hover:bg-primary/90"
            )}>
              Next Question <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
