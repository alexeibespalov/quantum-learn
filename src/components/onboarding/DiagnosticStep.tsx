"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DiagnosticQuestion, DiagnosticResults, DiagnosticResponse } from "@/types";
import {
  IRTState,
  createInitialIRTState,
  selectNextQuestion,
  updateAbilityEstimate,
  calculateMasteryScores,
} from "@/lib/utils/irt";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { Timestamp } from "firebase/firestore";

interface DiagnosticStepProps {
  onNext: (data: {
    diagnosticResults: DiagnosticResults;
    diagnosticResponses: DiagnosticResponse[];
  }) => void;
}

const TOTAL_QUESTIONS = 20;

const subjectLabels: Record<string, string> = {
  maths: "Mathematics",
  english: "English",
  science: "Science",
  french: "French",
};

const subjectColors: Record<string, string> = {
  maths: "bg-blue-100 text-blue-700",
  english: "bg-purple-100 text-purple-700",
  science: "bg-green-100 text-green-700",
  french: "bg-red-100 text-red-700",
};

export function DiagnosticStep({ onNext }: DiagnosticStepProps) {
  const [irtState, setIrtState] = useState<IRTState>(createInitialIRTState);
  const [currentQuestion, setCurrentQuestion] = useState<DiagnosticQuestion | null>(
    null
  );
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const questionStartTime = useRef<number>(Date.now());

  useEffect(() => {
    const question = selectNextQuestion(irtState, TOTAL_QUESTIONS);
    setCurrentQuestion(question);
    questionStartTime.current = Date.now();
  }, []);

  const handleAnswerSelect = (index: number) => {
    if (showFeedback) return;
    setSelectedAnswer(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null || !currentQuestion) return;

    const timeSpent = Date.now() - questionStartTime.current;
    const correct = selectedAnswer === currentQuestion.correctIndex;
    setIsCorrect(correct);
    setShowFeedback(true);

    // Update IRT state
    const newState = updateAbilityEstimate(
      irtState,
      currentQuestion,
      correct,
      timeSpent
    );
    setIrtState(newState);

    // After feedback, move to next question
    setTimeout(() => {
      setShowFeedback(false);
      setSelectedAnswer(null);

      if (newState.questionsAnswered >= TOTAL_QUESTIONS) {
        // Complete diagnostic
        const scores = calculateMasteryScores(newState);
        onNext({
          diagnosticResults: {
            maths: scores.maths,
            english: scores.english,
            science: scores.science,
            french: scores.french,
            completedAt: Timestamp.now(),
          },
          diagnosticResponses: newState.responses,
        });
      } else {
        const nextQuestion = selectNextQuestion(newState, TOTAL_QUESTIONS);
        setCurrentQuestion(nextQuestion);
        questionStartTime.current = Date.now();
      }
    }, 1500);
  };

  if (!currentQuestion) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const progress = (irtState.questionsAnswered / TOTAL_QUESTIONS) * 100;

  return (
    <div className="max-w-2xl mx-auto px-4">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Quick Assessment
        </h1>
        <p className="text-gray-600">
          Answer these questions so we can personalize your learning
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Question {irtState.questionsAnswered + 1} of {TOTAL_QUESTIONS}</span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary-600"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          {/* Subject Badge */}
          <span
            className={cn(
              "inline-block px-3 py-1 rounded-full text-sm font-medium mb-4",
              subjectColors[currentQuestion.subject]
            )}
          >
            {subjectLabels[currentQuestion.subject]}
          </span>

          {/* Question */}
          <h2 className="text-xl font-medium text-gray-900 mb-6">
            {currentQuestion.text}
          </h2>

          {/* Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={showFeedback}
                className={cn(
                  "w-full p-4 rounded-lg border-2 text-left transition-all",
                  selectedAnswer === index
                    ? showFeedback
                      ? isCorrect
                        ? "border-green-500 bg-green-50"
                        : "border-red-500 bg-red-50"
                      : "border-primary-500 bg-primary-50"
                    : showFeedback && index === currentQuestion.correctIndex
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50",
                  showFeedback && "cursor-not-allowed"
                )}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm",
                      selectedAnswer === index
                        ? "bg-primary-600 text-white"
                        : "bg-gray-100 text-gray-600"
                    )}
                  >
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="text-gray-800">{option}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Feedback */}
          {showFeedback && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "mt-4 p-4 rounded-lg",
                isCorrect ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              )}
            >
              {isCorrect ? "Correct! Well done!" : "Not quite. Let's move on!"}
            </motion.div>
          )}

          {/* Submit Button */}
          {!showFeedback && (
            <Button
              onClick={handleSubmitAnswer}
              disabled={selectedAnswer === null}
              className="w-full mt-6"
              size="lg"
            >
              Submit Answer
            </Button>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Skip Assessment Option */}
      <p className="text-center text-sm text-gray-500 mt-6">
        This helps us personalize your experience
      </p>
    </div>
  );
}
