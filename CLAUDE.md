# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

QuantumLearn is an AI-powered tutoring platform MVP for Year 9 UK students (ages 13-14). The app combines evidence-based learning science (spaced repetition, active recall, interleaving) with gamification to deliver personalized education across 12 Year 9 subjects.

## Tech Stack

- **Frontend**: Next.js 15, React 18
- **Backend/Database**: Firebase (Auth, Firestore, Storage)
- **AI**: Firebase GenKit for conversational AI tutor
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form + Zod validation
- **Animations**: Framer Motion
- **Icons**: Lucide React

## Development Commands

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Environment Setup

Copy `.env.local.example` to `.env.local` and configure Firebase credentials:
```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

## Architecture

### Route Structure (App Router)
```
/
├── (auth)/login, /signup, /onboarding
├── (app)/ - Authenticated wrapper
│   ├── /dashboard - Daily mission, review alerts, progress
│   ├── /subjects, /subjects/[subjectId] - Course catalog
│   ├── /lesson/[lessonId] - Video/text player with embedded quizzes
│   ├── /practice/[topicId] - Active recall practice
│   ├── /review - Spaced repetition flashcard system
│   ├── /tutor - AI chat (Socratic method)
│   ├── /progress - Analytics dashboard
│   └── /settings
```

### Core Systems

1. **Spaced Repetition System (SRS)**: SM-2 algorithm variant with intervals (1, 3, 7, 14 days) based on self-assessment ratings (Again/Hard/Good/Easy)

2. **AI Tutor**: Firebase GenKit with Socratic prompting - guides students to answers rather than providing direct solutions

3. **Gamification**: XP, levels, streaks, skill trees - intrinsically tied to curriculum mastery

4. **Adaptive Learning**: Item Response Theory (IRT) for difficulty adjustment, Bayesian knowledge tracing

### Key Features
- Video lessons with embedded quiz checkpoints
- LaTeX/KaTeX math rendering throughout
- Multi-subject diagnostic assessment in onboarding
- Visual skill tree showing subject mastery progression

## Development Notes

- Target audience: Visual learners, gamers with ~47-second digital attention spans
- Content chunked into 5-7 minute microlearning modules
- All content must support accessibility (captions, high contrast, font size options)
- French track follows Hayes School CFM curriculum structure

## Project Structure

```
src/
├── app/
│   ├── (auth)/          # Auth pages (login, signup, onboarding, verify-email, forgot-password)
│   ├── (app)/           # Authenticated app pages (dashboard, subjects, review, tutor, progress, settings)
│   ├── layout.tsx       # Root layout with AuthProvider
│   └── page.tsx         # Root redirect logic
├── components/
│   ├── auth/            # AuthGuard
│   ├── layout/          # Sidebar, TopBar, MobileNav
│   ├── onboarding/      # WelcomeStep, DiagnosticStep, GoalsStep, ProgressIndicator
│   └── ui/              # Button, Input
├── config/
│   └── avatars.ts       # Avatar definitions
├── context/
│   └── AuthContext.tsx  # Firebase auth state provider
├── data/
│   └── diagnostic-questions.ts  # IRT diagnostic quiz questions
├── lib/
│   ├── firebase/        # config.ts, auth.ts, firestore.ts
│   ├── utils/
│   │   └── irt.ts       # Item Response Theory algorithm
│   └── utils.ts         # cn() helper for classnames
└── types/
    └── index.ts         # TypeScript interfaces (UserProfile, DiagnosticQuestion, etc.)
```

## MCP Integrations

Linear MCP server configured for project management at `https://mcp.linear.app/mcp`
