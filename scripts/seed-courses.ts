import { initializeApp } from "firebase/app";
import {
  getFirestore,
  connectFirestoreEmulator,
  collection,
  doc,
  setDoc,
  Timestamp,
} from "firebase/firestore";
import type { Course } from "../src/types/course";

// Initialize Firebase (use emulator in development)
const app = initializeApp({
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "quantum-learn-dev",
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "test-key",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "test.firebaseapp.com",
});

const db = getFirestore(app);

// Connect to emulator if in development
if (process.env.NODE_ENV === "development" || process.env.USE_EMULATOR === "true") {
  try {
    connectFirestoreEmulator(db, "localhost", 8080);
  } catch (error) {
    // Emulator already connected, ignore
    console.log("Emulator connection skipped (may already be connected)");
  }
}

async function seedCourses() {
  const now = Timestamp.now();

  // Mathematics Course
  const mathCourse: Course = {
    id: "math-fundamentals",
    subjectId: "mathematics",
    title: "Mathematics Fundamentals",
    description: "Learn the basics of mathematics including number operations, algebra, and geometry.",
    icon: "calculator",
    level: 1,
    estimatedDuration: 120,
    prerequisites: [],
    modules: [
      {
        id: "math-mod-1",
        title: "Number Operations",
        description: "Master basic arithmetic operations",
        order: 1,
        lessons: [
          {
            id: "math-lesson-1",
            type: "video",
            title: "Introduction to Order of Operations",
            description: "Learn the correct order to perform mathematical operations",
            duration: 12,
            order: 1,
            content: {
              videoUrl: "https://example.com/videos/math-order-operations.mp4",
              transcript: "Welcome to order of operations. In mathematics, we follow a specific order...",
              duration: 720,
            },
            embeddedQuestions: [
              {
                id: "math-emb-1",
                timestamp: 180,
                question: "What is the correct order of operations?",
                type: "multiple-choice",
                options: ["PEMDAS", "PEDMAS", "BODMAS", "All of the above"],
                correctAnswer: 0,
                explanation: "PEMDAS stands for Parentheses, Exponents, Multiplication/Division, Addition/Subtraction",
                points: 10,
              },
            ],
            comprehensionCheck: [
              {
                id: "math-comp-1",
                question: "What does PEMDAS stand for?",
                type: "multiple-choice",
                options: [
                  "Parentheses, Exponents, Multiplication, Division, Addition, Subtraction",
                  "Please Excuse My Dear Aunt Sally",
                  "Both A and B",
                  "None of the above",
                ],
                correctAnswer: 2,
                explanation: "PEMDAS is both a mnemonic device and represents the order of operations",
                points: 15,
              },
              {
                id: "math-comp-2",
                question: "In the expression 2 + 3 × 4, what is the correct answer?",
                type: "multiple-choice",
                options: ["20", "14", "24", "11"],
                correctAnswer: 1,
                explanation: "Multiplication comes before addition, so 3 × 4 = 12, then 2 + 12 = 14",
                points: 15,
              },
            ],
          },
          {
            id: "math-lesson-2",
            type: "text",
            title: "Fractions and Decimals",
            description: "Understanding fractions and their decimal equivalents",
            duration: 10,
            order: 2,
            content: {
              markdown: "# Fractions and Decimals\n\nFractions represent parts of a whole...",
              sections: [
                {
                  id: "frac-sec-1",
                  title: "Introduction to Fractions",
                  content: "A fraction consists of a numerator and a denominator...",
                  order: 1,
                },
                {
                  id: "frac-sec-2",
                  title: "Converting to Decimals",
                  content: "To convert a fraction to a decimal, divide the numerator by the denominator...",
                  order: 2,
                },
              ],
            },
            embeddedQuestions: [],
            comprehensionCheck: [
              {
                id: "math-comp-3",
                question: "What is 1/2 as a decimal?",
                type: "multiple-choice",
                options: ["0.25", "0.5", "0.75", "1.0"],
                correctAnswer: 1,
                explanation: "1 divided by 2 equals 0.5",
                points: 10,
              },
            ],
          },
        ],
      },
    ],
    createdAt: now,
    updatedAt: now,
  };

  // English Course
  const englishCourse: Course = {
    id: "english-basics",
    subjectId: "english",
    title: "English Language & Literature Basics",
    description: "Develop your reading, writing, and comprehension skills.",
    icon: "book-open",
    level: 1,
    estimatedDuration: 150,
    prerequisites: [],
    modules: [
      {
        id: "eng-mod-1",
        title: "Writing Skills",
        description: "Learn to write clear and effective essays",
        order: 1,
        lessons: [
          {
            id: "eng-lesson-1",
            type: "video",
            title: "Essay Structure and Planning",
            description: "Learn how to structure an essay effectively",
            duration: 15,
            order: 1,
            content: {
              videoUrl: "https://example.com/videos/english-essay-structure.mp4",
              transcript: "Welcome to essay writing. A well-structured essay has three main parts...",
              duration: 900,
            },
            embeddedQuestions: [
              {
                id: "eng-emb-1",
                timestamp: 240,
                question: "What are the three main parts of an essay?",
                type: "multiple-choice",
                options: [
                  "Introduction, Body, Conclusion",
                  "Title, Paragraphs, End",
                  "Beginning, Middle, End",
                  "Thesis, Arguments, Summary",
                ],
                correctAnswer: 0,
                explanation: "An essay typically has an introduction, body paragraphs, and a conclusion",
                points: 10,
              },
            ],
            comprehensionCheck: [
              {
                id: "eng-comp-1",
                question: "What should an introduction paragraph include?",
                type: "multiple-choice",
                options: [
                  "Hook, background information, thesis statement",
                  "Only the thesis statement",
                  "All the main arguments",
                  "The conclusion",
                ],
                correctAnswer: 0,
                explanation: "A good introduction hooks the reader, provides context, and presents the thesis",
                points: 15,
              },
            ],
          },
          {
            id: "eng-lesson-2",
            type: "text",
            title: "Grammar and Punctuation",
            description: "Master essential grammar rules",
            duration: 12,
            order: 2,
            content: {
              markdown: "# Grammar and Punctuation\n\nProper grammar is essential for clear communication...",
              sections: [
                {
                  id: "gram-sec-1",
                  title: "Parts of Speech",
                  content: "Understanding nouns, verbs, adjectives, and other parts of speech...",
                  order: 1,
                },
                {
                  id: "gram-sec-2",
                  title: "Common Punctuation Marks",
                  content: "Periods, commas, semicolons, and colons each have specific uses...",
                  order: 2,
                },
              ],
            },
            embeddedQuestions: [],
            comprehensionCheck: [
              {
                id: "eng-comp-2",
                question: "Which punctuation mark is used to separate items in a list?",
                type: "multiple-choice",
                options: ["Period", "Comma", "Semicolon", "Colon"],
                correctAnswer: 1,
                explanation: "Commas are used to separate items in a list",
                points: 10,
              },
            ],
          },
        ],
      },
    ],
    createdAt: now,
    updatedAt: now,
  };

  // French Course
  const frenchCourse: Course = {
    id: "french-basics",
    subjectId: "french",
    title: "French Language Basics",
    description: "Begin your journey learning French with essential vocabulary and grammar.",
    icon: "languages",
    level: 1,
    estimatedDuration: 180,
    prerequisites: [],
    modules: [
      {
        id: "fr-mod-1",
        title: "Verb Tenses",
        description: "Learn present, past, and future tenses in French",
        order: 1,
        lessons: [
          {
            id: "fr-lesson-1",
            type: "video",
            title: "Present Tense (Le Présent)",
            description: "Learn how to conjugate regular verbs in the present tense",
            duration: 18,
            order: 1,
            content: {
              videoUrl: "https://example.com/videos/french-present-tense.mp4",
              transcript: "Bonjour! Aujourd'hui, nous allons apprendre le présent...",
              duration: 1080,
            },
            embeddedQuestions: [
              {
                id: "fr-emb-1",
                timestamp: 300,
                question: "How do you conjugate 'parler' (to speak) in the 'nous' form?",
                type: "multiple-choice",
                options: ["parle", "parles", "parlons", "parlez"],
                correctAnswer: 2,
                explanation: "The 'nous' form of -er verbs ends in -ons, so 'parler' becomes 'parlons'",
                points: 10,
              },
            ],
            comprehensionCheck: [
              {
                id: "fr-comp-1",
                question: "What is the 'je' form of 'manger' (to eat)?",
                type: "multiple-choice",
                options: ["mange", "manges", "mangons", "mangez"],
                correctAnswer: 0,
                explanation: "The 'je' form of -er verbs is the stem, so 'manger' becomes 'mange'",
                points: 15,
              },
              {
                id: "fr-comp-2",
                question: "True or False: All French verbs follow the same conjugation pattern",
                type: "true-false",
                correctAnswer: 0,
                explanation: "False. French has regular and irregular verbs with different patterns",
                points: 10,
              },
            ],
          },
          {
            id: "fr-lesson-2",
            type: "text",
            title: "Vocabulary Building",
            description: "Expand your French vocabulary with common words and phrases",
            duration: 15,
            order: 2,
            content: {
              markdown: "# Vocabulary Building\n\nBuilding a strong vocabulary is essential for learning French...",
              sections: [
                {
                  id: "vocab-sec-1",
                  title: "Common Greetings",
                  content: "Bonjour (hello), Bonsoir (good evening), Au revoir (goodbye)...",
                  order: 1,
                },
                {
                  id: "vocab-sec-2",
                  title: "Numbers 1-100",
                  content: "Un (1), deux (2), trois (3)...",
                  order: 2,
                },
              ],
            },
            embeddedQuestions: [],
            comprehensionCheck: [
              {
                id: "fr-comp-3",
                question: "What does 'Bonjour' mean?",
                type: "multiple-choice",
                options: ["Goodbye", "Hello", "Thank you", "Please"],
                correctAnswer: 1,
                explanation: "Bonjour means hello or good day in French",
                points: 10,
              },
            ],
          },
        ],
      },
    ],
    createdAt: now,
    updatedAt: now,
  };

  // Seed courses to Firestore
  const courses = [mathCourse, englishCourse, frenchCourse];

  console.log("Seeding courses to Firestore...");

  for (const course of courses) {
    const courseRef = doc(collection(db, "courses"), course.id);
    await setDoc(courseRef, course);
    console.log(`✓ Seeded course: ${course.title} (${course.id})`);
  }

  console.log(`\n✓ Successfully seeded ${courses.length} courses with modules and lessons!`);
}

// Run the seed function
seedCourses()
  .then(() => {
    console.log("Seed script completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error seeding courses:", error);
    process.exit(1);
  });

