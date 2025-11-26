"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import type { ComprehensionCheck } from "@/types/course";

interface ComprehensionQuizProps {
  questions: ComprehensionCheck[];
  onComplete: (score: number, totalPoints: number) => void;
}

export function ComprehensionQuiz({
  questions,
  onComplete,
}: ComprehensionQuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Map<number, string | number>>(new Map());
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const currentQuestion = questions[currentQuestionIndex];
  const selectedAnswer = answers.get(currentQuestionIndex);

  const handleAnswerSelect = (answer: string | number) => {
    setAnswers(new Map(answers.set(currentQuestionIndex, answer)));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      calculateScore();
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const calculateScore = () => {
    let totalScore = 0;
    questions.forEach((question, index) => {
      const answer = answers.get(index);
      if (answer === question.correctAnswer) {
        totalScore += question.points;
      }
    });

    setScore(totalScore);
    const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);
    onComplete(totalScore, totalPoints);
  };

  const getQuestionResult = (index: number) => {
    const question = questions[index];
    const answer = answers.get(index);
    return {
      isCorrect: answer === question.correctAnswer,
      explanation: question.explanation,
    };
  };

  if (showResults) {
    const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);
    const percentage = Math.round((score / totalPoints) * 100);

    return (
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Quiz Complete!</h2>
          <div className="text-4xl font-bold text-primary-600 mb-2">
            {score} / {totalPoints}
          </div>
          <div className="text-lg text-gray-600">{percentage}%</div>
        </div>

        <div className="space-y-6 mb-8">
          {questions.map((question, index) => {
            const result = getQuestionResult(index);
            const answer = answers.get(index);

            return (
              <div
                key={question.id}
                className={`p-4 rounded-lg border-2 ${
                  result.isCorrect
                    ? "border-green-200 bg-green-50"
                    : "border-red-200 bg-red-50"
                }`}
              >
                <div className="flex items-start gap-2 mb-2">
                  <span className="font-semibold text-gray-900">
                    {result.isCorrect ? "✓" : "✗"}
                  </span>
                  <p className="text-gray-900 font-medium">{question.question}</p>
                </div>
                <p className="text-sm text-gray-600 ml-6">{result.explanation}</p>
              </div>
            );
          })}
        </div>

        <div className="text-center">
          <Button onClick={() => window.location.reload()} size="lg">
            Review Lesson
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Comprehension Check</h2>
          <span className="text-sm text-gray-600">
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary-500 transition-all"
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="mb-6">
        <p className="text-lg text-gray-900 mb-6">{currentQuestion.question}</p>

        {/* Multiple Choice */}
        {currentQuestion.type === "multiple-choice" && currentQuestion.options && (
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  selectedAnswer === index
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
        {currentQuestion.type === "true-false" && (
          <div className="space-y-3">
            {[true, false].map((value, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  selectedAnswer === index
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
        {currentQuestion.type === "short-answer" && (
          <div>
            <textarea
              value={(selectedAnswer as string) || ""}
              onChange={(e) => handleAnswerSelect(e.target.value)}
              placeholder="Type your answer here..."
              className="w-full p-4 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
              rows={4}
            />
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <Button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          variant="outline"
        >
          Previous
        </Button>
        <Button onClick={handleNext} disabled={selectedAnswer === undefined}>
          {currentQuestionIndex === questions.length - 1 ? "Submit Quiz" : "Next"}
        </Button>
      </div>
    </div>
  );
}

