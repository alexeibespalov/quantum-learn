import { DiagnosticQuestion } from "@/types";

export const diagnosticQuestions: DiagnosticQuestion[] = [
  // MATHS - 15 questions across difficulties
  {
    id: "maths-1",
    subject: "maths",
    difficulty: 1,
    text: "What is 15 + 27?",
    options: ["32", "42", "52", "41"],
    correctIndex: 1,
  },
  {
    id: "maths-2",
    subject: "maths",
    difficulty: 2,
    text: "What is 3/4 as a decimal?",
    options: ["0.25", "0.5", "0.75", "0.34"],
    correctIndex: 2,
  },
  {
    id: "maths-3",
    subject: "maths",
    difficulty: 2,
    text: "Solve: 2x + 5 = 13. What is x?",
    options: ["3", "4", "5", "9"],
    correctIndex: 1,
  },
  {
    id: "maths-4",
    subject: "maths",
    difficulty: 3,
    text: "What is the area of a triangle with base 8cm and height 6cm?",
    options: ["48 cm²", "24 cm²", "14 cm²", "28 cm²"],
    correctIndex: 1,
  },
  {
    id: "maths-5",
    subject: "maths",
    difficulty: 3,
    text: "Simplify: 3(2x - 4) + 2x",
    options: ["8x - 12", "6x - 4", "8x - 4", "6x - 12"],
    correctIndex: 0,
  },
  {
    id: "maths-6",
    subject: "maths",
    difficulty: 4,
    text: "Using Pythagoras' theorem, find the hypotenuse when the other sides are 3cm and 4cm.",
    options: ["7 cm", "5 cm", "6 cm", "25 cm"],
    correctIndex: 1,
  },
  {
    id: "maths-7",
    subject: "maths",
    difficulty: 4,
    text: "Factorise: x² + 5x + 6",
    options: ["(x+2)(x+3)", "(x+1)(x+6)", "(x+2)(x+4)", "(x-2)(x-3)"],
    correctIndex: 0,
  },
  {
    id: "maths-8",
    subject: "maths",
    difficulty: 5,
    text: "Solve the simultaneous equations: 2x + y = 7 and x - y = 2",
    options: ["x=3, y=1", "x=2, y=3", "x=4, y=-1", "x=1, y=5"],
    correctIndex: 0,
  },

  // ENGLISH - 15 questions
  {
    id: "english-1",
    subject: "english",
    difficulty: 1,
    text: "Which word is a noun?",
    options: ["Running", "Quickly", "Beautiful", "Happiness"],
    correctIndex: 3,
  },
  {
    id: "english-2",
    subject: "english",
    difficulty: 2,
    text: "Identify the correct sentence:",
    options: [
      "Their going to the park",
      "They're going to the park",
      "There going to the park",
      "Theyre going to the park",
    ],
    correctIndex: 1,
  },
  {
    id: "english-3",
    subject: "english",
    difficulty: 2,
    text: "What is a metaphor?",
    options: [
      "A comparison using 'like' or 'as'",
      "A direct comparison without 'like' or 'as'",
      "A type of rhyme scheme",
      "An exaggeration",
    ],
    correctIndex: 1,
  },
  {
    id: "english-4",
    subject: "english",
    difficulty: 3,
    text: "In Shakespeare's Romeo and Juliet, what is the relationship between the Montagues and Capulets?",
    options: ["Friends", "Business partners", "Enemies/feuding families", "Neighbors"],
    correctIndex: 2,
  },
  {
    id: "english-5",
    subject: "english",
    difficulty: 3,
    text: "What is the purpose of a topic sentence?",
    options: [
      "To conclude a paragraph",
      "To introduce the main idea of a paragraph",
      "To provide evidence",
      "To ask a question",
    ],
    correctIndex: 1,
  },
  {
    id: "english-6",
    subject: "english",
    difficulty: 4,
    text: "What literary technique is 'The wind whispered through the trees'?",
    options: ["Simile", "Metaphor", "Personification", "Alliteration"],
    correctIndex: 2,
  },
  {
    id: "english-7",
    subject: "english",
    difficulty: 4,
    text: "Which sentence uses the passive voice?",
    options: [
      "The dog chased the cat",
      "The cat was chased by the dog",
      "The dog is chasing the cat",
      "The cat ran away",
    ],
    correctIndex: 1,
  },
  {
    id: "english-8",
    subject: "english",
    difficulty: 5,
    text: "In analytical writing, what does PEE stand for?",
    options: [
      "Point, Evidence, Explain",
      "Paragraph, Example, Evaluate",
      "Purpose, Effect, Evidence",
      "Point, Examine, Elaborate",
    ],
    correctIndex: 0,
  },

  // SCIENCE - 15 questions
  {
    id: "science-1",
    subject: "science",
    difficulty: 1,
    text: "What is the powerhouse of the cell?",
    options: ["Nucleus", "Mitochondria", "Cell membrane", "Ribosome"],
    correctIndex: 1,
  },
  {
    id: "science-2",
    subject: "science",
    difficulty: 2,
    text: "What is the chemical formula for water?",
    options: ["H2O", "CO2", "O2", "NaCl"],
    correctIndex: 0,
  },
  {
    id: "science-3",
    subject: "science",
    difficulty: 2,
    text: "Which organ system is responsible for transporting blood?",
    options: ["Digestive", "Respiratory", "Circulatory", "Nervous"],
    correctIndex: 2,
  },
  {
    id: "science-4",
    subject: "science",
    difficulty: 3,
    text: "What happens during photosynthesis?",
    options: [
      "Plants release carbon dioxide",
      "Plants convert light energy into chemical energy",
      "Plants break down glucose",
      "Plants absorb oxygen",
    ],
    correctIndex: 1,
  },
  {
    id: "science-5",
    subject: "science",
    difficulty: 3,
    text: "What is the unit of electrical resistance?",
    options: ["Volts", "Amps", "Watts", "Ohms"],
    correctIndex: 3,
  },
  {
    id: "science-6",
    subject: "science",
    difficulty: 4,
    text: "In the periodic table, elements in the same group have...",
    options: [
      "The same number of protons",
      "Similar chemical properties",
      "The same atomic mass",
      "The same number of neutrons",
    ],
    correctIndex: 1,
  },
  {
    id: "science-7",
    subject: "science",
    difficulty: 4,
    text: "What type of reaction is: 2H₂ + O₂ → 2H₂O?",
    options: ["Decomposition", "Combustion", "Neutralisation", "Displacement"],
    correctIndex: 1,
  },
  {
    id: "science-8",
    subject: "science",
    difficulty: 5,
    text: "Calculate the speed of a car that travels 150m in 10 seconds.",
    options: ["10 m/s", "15 m/s", "150 m/s", "1500 m/s"],
    correctIndex: 1,
  },

  // FRENCH - 15 questions
  {
    id: "french-1",
    subject: "french",
    difficulty: 1,
    text: "How do you say 'hello' in French?",
    options: ["Adieu", "Bonjour", "Merci", "S'il vous plaît"],
    correctIndex: 1,
  },
  {
    id: "french-2",
    subject: "french",
    difficulty: 2,
    text: "What does 'Je m'appelle' mean?",
    options: ["I live in", "My name is", "I like", "I am"],
    correctIndex: 1,
  },
  {
    id: "french-3",
    subject: "french",
    difficulty: 2,
    text: "What is 'vingt-cinq' in English?",
    options: ["15", "20", "25", "35"],
    correctIndex: 2,
  },
  {
    id: "french-4",
    subject: "french",
    difficulty: 3,
    text: "Choose the correct form: 'Nous _____ au cinéma' (aller)",
    options: ["va", "vais", "allons", "allez"],
    correctIndex: 2,
  },
  {
    id: "french-5",
    subject: "french",
    difficulty: 3,
    text: "What is the past participle of 'faire'?",
    options: ["fais", "fait", "faisant", "faisait"],
    correctIndex: 1,
  },
  {
    id: "french-6",
    subject: "french",
    difficulty: 4,
    text: "Translate: 'I went to the beach yesterday'",
    options: [
      "Je vais à la plage hier",
      "Je suis allé à la plage hier",
      "J'irai à la plage demain",
      "J'allais à la plage hier",
    ],
    correctIndex: 1,
  },
  {
    id: "french-7",
    subject: "french",
    difficulty: 4,
    text: "Which sentence expresses an opinion?",
    options: [
      "Il fait beau",
      "J'ai deux frères",
      "Je pense que c'est intéressant",
      "Elle habite à Paris",
    ],
    correctIndex: 2,
  },
  {
    id: "french-8",
    subject: "french",
    difficulty: 5,
    text: "Complete with the correct pronoun: '_____ livre est sur la table' (my)",
    options: ["Ma", "Mon", "Mes", "Notre"],
    correctIndex: 1,
  },
];

export function getQuestionsBySubject(
  subject: "maths" | "english" | "science" | "french"
): DiagnosticQuestion[] {
  return diagnosticQuestions.filter((q) => q.subject === subject);
}

export function getQuestionsByDifficulty(
  difficulty: number
): DiagnosticQuestion[] {
  return diagnosticQuestions.filter((q) => q.difficulty === difficulty);
}
