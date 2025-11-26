# QuantumLearn Project Context

## Project Overview

QuantumLearn is an AI-powered tutoring platform MVP designed for Year 9 UK students (ages 13-14). The application leverages evidence-based learning science—specifically spaced repetition, active recall, and interleaving—combined with gamification to deliver personalized education across 12 subjects.

**Key Features:**
- **AI Tutor:** Socratic method-based conversational agent using Firebase GenKit.
- **Spaced Repetition System (SRS):** Flashcard review system with SM-2 variant algorithm.
- **Gamification:** XP, levels, streaks, and skill trees to drive engagement.
- **Adaptive Learning:** Diagnostic assessments and difficulty adjustment using Item Response Theory (IRT).
- **Curriculum:** Covers 12 Year 9 subjects including Mathematics, English, Science, and French.

## Tech Stack

- **Frontend:** Next.js 15 (App Router), React 18, TypeScript
- **Styling:** Tailwind CSS, Framer Motion (animations), Lucide React (icons)
- **Backend:** Firebase (Authentication, Firestore, Storage, Cloud Functions)
- **AI:** Firebase GenKit
- **State Management:** React Context (AuthContext)
- **Testing:** Vitest, React Testing Library
- **Validation:** Zod, React Hook Form

## Architecture

### Directory Structure
- `src/app`: Next.js App Router pages and layouts.
    - `(auth)`: Authentication routes (login, signup, onboarding).
    - `(app)`: Authenticated application routes (dashboard, subjects, lessons, tutor).
- `src/components`: Reusable UI components.
- `src/lib/firebase`: Firebase configuration and service modules.
- `src/types`: TypeScript type definitions (Data models).
- `functions`: Firebase Cloud Functions.
- `courses`: Course content data.

### Data Models
Key interfaces defined in `src/types/index.ts`:
- `UserProfile`: Stores user progress, settings, and gamification stats.
- `DiagnosticQuestion`: Structure for assessment questions.
- `SUBJECTS`: Constant array of the 12 supported subjects.

## Development Workflow

### Prerequisites
- Node.js (v18+)
- Firebase CLI

### Commands
- **Start Development Server:** `npm run dev` (Runs on http://localhost:3000)
- **Build for Production:** `npm run build`
- **Start Production Server:** `npm run start`
- **Run Tests:** `npm run test` (Vitest)
- **Run Tests (Watch Mode):** `npm run test:watch`
- **Lint Code:** `npm run lint`
- **Seed Database:** `npm run seed:courses`

### Environment Setup
Create a `.env.local` file with the following Firebase credentials (see `.env.local.example`):
```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

### Local Emulators
The project is configured to use Firebase Emulators (`firebase.json`).
- **Auth:** Port 9099
- **Firestore:** Port 8080
- **Functions:** Port 5001
- **Storage:** Port 9199

## Coding Conventions

- **Components:** Functional components with TypeScript. Use `src/components` for modularity.
- **Styling:** Utility-first with Tailwind CSS. Use `cn()` helper from `src/lib/utils.ts` for conditional classes.
- **Imports:** Use absolute imports with `@/` alias (e.g., `import { Button } from "@/components/ui/Button"`).
- **Testing:** Write unit tests for components and hooks using Vitest and React Testing Library.
- **File Naming:** PascalCase for components (`MyComponent.tsx`), camelCase for utilities/hooks (`useHook.ts`).

## Documentation
- `CLAUDE.md`: Guide for AI coding assistants.
- `instructions.md`: Detailed product specifications and MVP goals.
- `PHASE2_PLAN.md`: Roadmap for future development.
