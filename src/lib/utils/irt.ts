import { DiagnosticQuestion, DiagnosticResponse } from "@/types";
import { diagnosticQuestions } from "@/data/diagnostic-questions";

export interface IRTState {
  currentAbility: Record<string, number>;
  questionsAnswered: number;
  responses: DiagnosticResponse[];
  usedQuestionIds: Set<string>;
}

export function createInitialIRTState(): IRTState {
  return {
    currentAbility: {
      maths: 3,
      english: 3,
      science: 3,
      french: 3,
    },
    questionsAnswered: 0,
    responses: [],
    usedQuestionIds: new Set(),
  };
}

/**
 * Selects the next question based on current ability estimate
 * Uses simple adaptive algorithm: select question closest to current ability
 */
export function selectNextQuestion(
  state: IRTState,
  targetQuestionCount: number = 20
): DiagnosticQuestion | null {
  // Determine which subject needs more questions
  const subjectCounts: Record<string, number> = {
    maths: 0,
    english: 0,
    science: 0,
    french: 0,
  };

  state.responses.forEach((r) => {
    subjectCounts[r.subject]++;
  });

  // Target 5 questions per subject (20 total / 4 subjects)
  const questionsPerSubject = Math.ceil(targetQuestionCount / 4);

  // Find subject that needs more questions
  const subjectsNeedingQuestions = Object.entries(subjectCounts)
    .filter(([, count]) => count < questionsPerSubject)
    .sort((a, b) => a[1] - b[1]); // Prioritize subjects with fewer questions

  if (subjectsNeedingQuestions.length === 0) {
    return null; // All subjects have enough questions
  }

  const targetSubject = subjectsNeedingQuestions[0][0] as
    | "maths"
    | "english"
    | "science"
    | "french";
  const targetDifficulty = Math.round(state.currentAbility[targetSubject]);

  // Get available questions for this subject
  const availableQuestions = diagnosticQuestions.filter(
    (q) => q.subject === targetSubject && !state.usedQuestionIds.has(q.id)
  );

  if (availableQuestions.length === 0) {
    // Try another subject if no questions available
    for (const [subject] of subjectsNeedingQuestions.slice(1)) {
      const questions = diagnosticQuestions.filter(
        (q) => q.subject === subject && !state.usedQuestionIds.has(q.id)
      );
      if (questions.length > 0) {
        const diff = Math.round(state.currentAbility[subject]);
        return selectQuestionByDifficulty(questions, diff);
      }
    }
    return null;
  }

  return selectQuestionByDifficulty(availableQuestions, targetDifficulty);
}

function selectQuestionByDifficulty(
  questions: DiagnosticQuestion[],
  targetDifficulty: number
): DiagnosticQuestion {
  // Sort by distance from target difficulty
  const sorted = [...questions].sort(
    (a, b) =>
      Math.abs(a.difficulty - targetDifficulty) -
      Math.abs(b.difficulty - targetDifficulty)
  );

  // Pick from closest matches with some randomness
  const candidates = sorted.slice(0, 3);
  return candidates[Math.floor(Math.random() * candidates.length)];
}

/**
 * Updates ability estimate based on response
 * Simple algorithm: adjust ability toward question difficulty based on correctness
 */
export function updateAbilityEstimate(
  state: IRTState,
  question: DiagnosticQuestion,
  wasCorrect: boolean,
  timeSpent: number
): IRTState {
  const { subject, difficulty } = question;
  const currentAbility = state.currentAbility[subject];

  // Adaptive adjustment
  let adjustment: number;
  if (wasCorrect) {
    // If correct on harder question, bigger boost
    adjustment = difficulty >= currentAbility ? 0.3 : 0.15;
  } else {
    // If wrong on easier question, bigger penalty
    adjustment = difficulty <= currentAbility ? -0.3 : -0.15;
  }

  const newAbility = Math.max(1, Math.min(5, currentAbility + adjustment));

  const newResponse: DiagnosticResponse = {
    questionId: question.id,
    correct: wasCorrect,
    difficulty,
    subject,
    timeSpent,
  };

  return {
    currentAbility: {
      ...state.currentAbility,
      [subject]: newAbility,
    },
    questionsAnswered: state.questionsAnswered + 1,
    responses: [...state.responses, newResponse],
    usedQuestionIds: new Set([...state.usedQuestionIds, question.id]),
  };
}

/**
 * Calculates final mastery scores (0-100) from ability estimates
 */
export function calculateMasteryScores(
  state: IRTState
): Record<string, number> {
  const scores: Record<string, number> = {};

  for (const [subject, ability] of Object.entries(state.currentAbility)) {
    // Convert 1-5 ability to 0-100 score
    // Also factor in accuracy for the subject
    const subjectResponses = state.responses.filter(
      (r) => r.subject === subject
    );
    const correctCount = subjectResponses.filter((r) => r.correct).length;
    const accuracy =
      subjectResponses.length > 0 ? correctCount / subjectResponses.length : 0.5;

    // Weighted score: 70% ability-based, 30% accuracy-based
    const abilityScore = ((ability - 1) / 4) * 100;
    const accuracyScore = accuracy * 100;
    scores[subject] = Math.round(abilityScore * 0.7 + accuracyScore * 0.3);
  }

  return scores;
}
