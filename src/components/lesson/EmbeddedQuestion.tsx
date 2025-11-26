"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { EmbeddedQuestion } from "@/types/course";

interface EmbeddedQuestionProps {
  question: EmbeddedQuestion;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (answer: string | number) => void;
}

export function EmbeddedQuestionModal({
  question,
  isOpen,
  onClose,
  onSubmit,
}: EmbeddedQuestionProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSelectedAnswer(null);
      setShowResult(false);
      setIsCorrect(false);
    }
  }, [isOpen, question.id]);

  const handleSubmit = () => {
    if (selectedAnswer === null) return;

    const correct = selectedAnswer === question.correctAnswer;
    setIsCorrect(correct);
    setShowResult(true);
    onSubmit(selectedAnswer);
  };

  const handleContinue = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Check Your Understanding</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Question */}
        <div className="p-6">
          <p className="text-lg text-gray-900 mb-6">{question.question}</p>

          {/* Multiple Choice */}
          {question.type === "multiple-choice" && question.options && (
            <div className="space-y-3">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => !showResult && setSelectedAnswer(index)}
                  disabled={showResult}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    showResult
                      ? index === question.correctAnswer
                        ? "border-green-500 bg-green-50"
                        : selectedAnswer === index && index !== question.correctAnswer
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200"
                      : selectedAnswer === index
                      ? "border-primary-500 bg-primary-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          )}

          {/* True/False */}
          {question.type === "true-false" && (
            <div className="space-y-3">
              {[true, false].map((value, index) => (
                <button
                  key={index}
                  onClick={() => !showResult && setSelectedAnswer(index)}
                  disabled={showResult}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    showResult
                      ? question.correctAnswer === index
                        ? "border-green-500 bg-green-50"
                        : selectedAnswer === index && question.correctAnswer !== index
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200"
                      : selectedAnswer === index
                      ? "border-primary-500 bg-primary-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {value ? "True" : "False"}
                </button>
              ))}
            </div>
          )}

          {/* Short Answer */}
          {question.type === "short-answer" && (
            <div>
              <textarea
                value={selectedAnswer as string || ""}
                onChange={(e) => !showResult && setSelectedAnswer(e.target.value)}
                disabled={showResult}
                placeholder="Type your answer here..."
                className="w-full p-4 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary-500 disabled:bg-gray-50"
                rows={4}
              />
            </div>
          )}

          {/* Result */}
          {showResult && (
            <div
              className={`mt-6 p-4 rounded-lg ${
                isCorrect ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
              }`}
            >
              <p className={`font-semibold mb-2 ${isCorrect ? "text-green-800" : "text-red-800"}`}>
                {isCorrect ? "✓ Correct!" : "✗ Incorrect"}
              </p>
              <p className="text-gray-700">{question.explanation}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          {!showResult ? (
            <Button onClick={handleSubmit} disabled={selectedAnswer === null}>
              Submit Answer
            </Button>
          ) : (
            <Button onClick={handleContinue}>Continue</Button>
          )}
        </div>
      </div>
    </div>
  );
}

