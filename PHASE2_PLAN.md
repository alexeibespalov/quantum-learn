# Phase 2: Core Learning - Implementation Plan

## Overview

This document outlines the Test-Driven Development (TDD) implementation plan for SHA-273 and its sub-issues (excluding SHA-275).

**Development Approach**: TDD - Write unit tests first, develop until all tests pass
**Testing Framework**: Vitest with Firestore Emulator
**Linear Tracking**: Update sub-issue status as each task completes

---

## Sub-Issues (In Order of Implementation)

| Issue | Title | Dependencies | Status |
|-------|-------|--------------|--------|
| SHA-274 | Design Firestore Course Schema | None | Pending |
| SHA-276 | Build Subject Navigation Pages | SHA-274 | Pending |
| SHA-277 | Create Video Lesson Player | SHA-274, SHA-279 | Pending |
| SHA-278 | Build Text Lesson Renderer | SHA-274, SHA-279 | Pending |
| SHA-279 | Implement Progress Tracking System | SHA-274 | Pending |

**Note**: SHA-275 (Create Initial Course Content - 45 Lessons) is **omitted** from this phase.

---

## Testing Setup Requirements

### 1. Install Testing Dependencies

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom @vitejs/plugin-react firebase-tools
```

### 2. Configure Vitest

Create `vitest.config.ts` with React and Firebase emulator support.

### 3. Firestore Emulator Setup

Use existing Firebase emulator configuration:
- Firestore: port 8080
- Auth: port 9099
- Storage: port 9199

Start emulators with: `firebase emulators:start`

---

## SHA-274: Design Firestore Course Schema

### Objective
Design and implement Firestore schema for courses with TypeScript types.

### TDD Tasks

#### 1. Create TypeScript Types (Test First)

**Test File**: `src/types/__tests__/course.types.test.ts`

```typescript
// Tests for:
// - Course interface validation
// - Module interface validation
// - Lesson interface validation (video, text, simulation types)
// - EmbeddedQuestion interface validation
// - ComprehensionCheck interface validation
```

**Implementation File**: `src/types/course.ts`

**Schema Structure**:
```
courses/{courseId}
├── id: string
├── subjectId: SubjectId
├── title: string
├── description: string
├── icon: string
├── level: 1-5
├── estimatedDuration: number (minutes)
├── prerequisites: string[]
├── modules: Module[]
│   ├── id: string
│   ├── title: string
│   ├── description: string
│   ├── order: number
│   ├── lessons: Lesson[]
│   │   ├── id: string
│   │   ├── type: 'video' | 'text' | 'simulation'
│   │   ├── title: string
│   │   ├── description: string
│   │   ├── duration: number (minutes)
│   │   ├── order: number
│   │   ├── content: VideoContent | TextContent | SimulationContent
│   │   ├── embeddedQuestions: EmbeddedQuestion[]
│   │   └── comprehensionCheck: ComprehensionCheck[]
├── createdAt: Timestamp
└── updatedAt: Timestamp
```

#### 2. Firestore Operations (Test First)

**Test File**: `src/lib/firebase/__tests__/courses.test.ts`

```typescript
// Tests with Firestore Emulator:
// - getCourse(courseId) returns course or null
// - getCoursesBySubject(subjectId) returns array
// - getAllCourses() returns all courses
// - getModule(courseId, moduleId) returns module
// - getLesson(courseId, moduleId, lessonId) returns lesson
```

**Implementation File**: `src/lib/firebase/courses.ts`

#### 3. Update Firestore Security Rules

**Test File**: `firestore.rules.test.ts` (if not exists)

Update `firestore.rules` with:
- Read access for authenticated users on courses collection
- Nested module/lesson read access

#### 4. Sample Data Seed Script

**File**: `scripts/seed-courses.ts`

Creates sample course data for 3 subjects (Math, English, French) with 1 module each containing 2-3 lessons.

### Acceptance Criteria Tests
- [ ] TypeScript types compile without errors
- [ ] All Firestore operations pass with emulator
- [ ] Security rules allow authenticated reads
- [ ] Seed script creates valid course documents

---

## SHA-276: Build Subject Navigation Pages

### Objective
Build subjects index and detail pages with real Firestore data.

### TDD Tasks

#### 1. Subject Service Layer (Test First)

**Test File**: `src/services/__tests__/subjects.test.ts`

```typescript
// Tests:
// - getSubjectsWithProgress(userId) returns subjects with progress data
// - getSubjectDetails(subjectId, userId) returns subject with modules/lessons
// - filterSubjectsByStatus(subjects, filter) correctly filters
```

**Implementation File**: `src/services/subjects.ts`

#### 2. Subject Card Component (Test First)

**Test File**: `src/components/subjects/__tests__/SubjectCard.test.tsx`

```typescript
// Tests:
// - Renders subject icon, title, subtitle correctly
// - Displays progress ring with correct percentage
// - Shows "Start" button when progress = 0
// - Shows "Continue" button when progress > 0
// - Links to correct subject detail page
```

**Implementation File**: `src/components/subjects/SubjectCard.tsx`

#### 3. Module Accordion Component (Test First)

**Test File**: `src/components/subjects/__tests__/ModuleAccordion.test.tsx`

```typescript
// Tests:
// - Renders module title and status icon
// - Expands/collapses on click
// - Shows lessons when expanded
// - Displays lock icon for locked modules
// - Shows lesson status indicators
```

**Implementation File**: `src/components/subjects/ModuleAccordion.tsx`

#### 4. Update Subjects Index Page

**Test File**: `src/app/(app)/subjects/__tests__/page.test.tsx`

```typescript
// Tests:
// - Fetches and displays subjects from Firestore
// - Filter tabs work correctly
// - Loading state displays
// - Error state displays
```

**Updates**: `src/app/(app)/subjects/page.tsx`

#### 5. Update Subject Detail Page

**Test File**: `src/app/(app)/subjects/[subjectId]/__tests__/page.test.tsx`

```typescript
// Tests:
// - Fetches subject details with modules/lessons
// - Displays mastery stats correctly
// - Module accordion works
// - Prerequisite locks enforced
// - Continue button links to next incomplete lesson
```

**Updates**: `src/app/(app)/subjects/[subjectId]/page.tsx`

### Acceptance Criteria Tests
- [ ] All 12 subjects display on index page
- [ ] Filter tabs function correctly
- [ ] Subject detail shows real modules/lessons from Firestore
- [ ] Prerequisites show locked state
- [ ] Progress percentages are accurate
- [ ] Responsive on mobile (320px) and desktop (1280px)

---

## SHA-279: Implement Progress Tracking System

### Objective
Implement comprehensive progress tracking with auto-save and resume.

### TDD Tasks

#### 1. Progress Types (Test First)

**Test File**: `src/types/__tests__/progress.types.test.ts`

**Implementation File**: `src/types/progress.ts`

**Schema**:
```
user_progress/{userId}/courses/{courseId}
├── lessonProgress: Map<lessonId, LessonProgress>
│   ├── status: 'not_started' | 'in_progress' | 'completed'
│   ├── startedAt: Timestamp
│   ├── completedAt?: Timestamp
│   ├── timeSpent: number (seconds)
│   ├── lastPosition: number (video timestamp or section index)
│   └── score?: number
├── moduleProgress: Map<moduleId, ModuleProgress>
│   ├── status: 'locked' | 'available' | 'in_progress' | 'completed'
│   ├── completedLessons: number
│   └── totalLessons: number
├── courseProgress: CourseProgress
│   ├── overallPercentage: number
│   ├── completedModules: number
│   ├── totalModules: number
│   └── masteryLevel: 1-5
└── lastUpdated: Timestamp
```

#### 2. Progress Service Layer (Test First)

**Test File**: `src/lib/firebase/__tests__/progress.test.ts`

```typescript
// Tests with Firestore Emulator:
// - getUserProgress(userId, courseId) returns progress or creates default
// - updateLessonProgress(userId, courseId, lessonId, data) updates correctly
// - markLessonComplete(userId, courseId, lessonId, score) marks complete
// - calculateModuleProgress(userId, courseId, moduleId) returns percentage
// - calculateCourseProgress(userId, courseId) returns overall progress
// - saveVideoPosition(userId, courseId, lessonId, position) persists
// - getResumePosition(userId, courseId, lessonId) returns last position
```

**Implementation File**: `src/lib/firebase/progress.ts`

#### 3. Progress Context/Hook (Test First)

**Test File**: `src/hooks/__tests__/useProgress.test.ts`

```typescript
// Tests:
// - useProgress hook loads progress on mount
// - Auto-saves progress on interval
// - Updates optimistically
// - Syncs with Firestore in background
```

**Implementation File**: `src/hooks/useProgress.ts`

#### 4. Update Security Rules

Update `firestore.rules`:
```
match /user_progress/{userId}/courses/{courseId} {
  allow read, write: if isOwner(userId);
}
```

### Acceptance Criteria Tests
- [ ] Progress auto-saves every 30 seconds during lesson
- [ ] Completion marks persist across sessions
- [ ] Video timestamp saves and resumes correctly
- [ ] Progress percentages aggregate correctly (lesson → module → course)
- [ ] Real-time updates work across browser tabs

---

## SHA-277: Create Video Lesson Player

### Objective
Build custom video player with learning features and embedded quizzes.

### TDD Tasks

#### 1. Video Player Base Component (Test First)

**Test File**: `src/components/lesson/__tests__/VideoPlayer.test.tsx`

```typescript
// Tests:
// - Renders video element with controls
// - Play/pause toggles correctly
// - Seek updates video time
// - Volume control works
// - Playback speed changes (0.75x, 1x, 1.25x, 1.5x)
// - Fullscreen toggle works
// - Captions toggle works
// - Keyboard shortcuts (space, arrows)
```

**Implementation File**: `src/components/lesson/VideoPlayer.tsx`

#### 2. Embedded Question Modal (Test First)

**Test File**: `src/components/lesson/__tests__/EmbeddedQuestion.test.tsx`

```typescript
// Tests:
// - Displays question at correct timestamp
// - Pauses video when triggered
// - Shows question text and options
// - Validates answer on submit
// - Shows feedback (correct/incorrect)
// - Resumes video after answer
// - Cannot skip without answering (or with confirmation)
```

**Implementation File**: `src/components/lesson/EmbeddedQuestion.tsx`

#### 3. Transcript Panel Component (Test First)

**Test File**: `src/components/lesson/__tests__/TranscriptPanel.test.tsx`

```typescript
// Tests:
// - Renders transcript text
// - Auto-scrolls with video playback
// - Click timestamp jumps to video time
// - Search functionality filters text
// - Synchronized highlight for current section
```

**Implementation File**: `src/components/lesson/TranscriptPanel.tsx`

#### 4. Comprehension Quiz Component (Test First)

**Test File**: `src/components/lesson/__tests__/ComprehensionQuiz.test.tsx`

```typescript
// Tests:
// - Displays 3-5 questions sequentially
// - Validates answers with immediate feedback
// - Shows explanation for each
// - Tracks score
// - Shows XP reward animation on completion
```

**Implementation File**: `src/components/lesson/ComprehensionQuiz.tsx`

#### 5. Video Lesson Page (Test First)

**Test File**: `src/app/(app)/lesson/__tests__/[lessonId]/page.test.tsx`

```typescript
// Tests:
// - Loads video lesson from Firestore
// - Integrates all video components
// - Saves progress on video events
// - Shows end-of-lesson flow
// - XP awarded on completion
```

**Implementation Files**:
- `src/app/(app)/lesson/[lessonId]/page.tsx`
- `src/app/(app)/lesson/[lessonId]/layout.tsx`

### Acceptance Criteria Tests
- [ ] Video plays smoothly on Chrome, Firefox, Safari
- [ ] Embedded questions trigger at correct timestamps
- [ ] Progress saves and resumes at correct position
- [ ] Transcript synchronized with video
- [ ] Captions functional
- [ ] XP awarded on completion
- [ ] Responsive design works on mobile

---

## SHA-278: Build Text Lesson Renderer

### Objective
Build markdown-based text lesson renderer with dual coding layout.

### TDD Tasks

#### 1. Markdown Renderer Component (Test First)

**Test File**: `src/components/lesson/__tests__/MarkdownRenderer.test.tsx`

```typescript
// Tests:
// - Renders basic markdown (headings, paragraphs, lists)
// - Renders LaTeX math inline: $x^2$
// - Renders LaTeX math block: $$E = mc^2$$
// - Syntax highlighting for code blocks
// - Renders images with captions
// - Custom component for definitions/callouts
```

**Implementation File**: `src/components/lesson/MarkdownRenderer.tsx`

**Dependencies**: 
- `react-markdown`
- `remark-math` + `rehype-katex`
- `rehype-highlight`

#### 2. Dual Coded Layout Component (Test First)

**Test File**: `src/components/lesson/__tests__/DualCodedLayout.test.tsx`

```typescript
// Tests:
// - Renders text on left, visual on right (desktop)
// - Stacks text above, visual below (mobile)
// - Synchronized scrolling between panels
// - Visual updates with text section
```

**Implementation File**: `src/components/lesson/DualCodedLayout.tsx`

#### 3. Interactive Diagram Component (Test First)

**Test File**: `src/components/lesson/__tests__/InteractiveDiagram.test.tsx`

```typescript
// Tests:
// - Renders image with hotspots
// - Hover on hotspot shows tooltip
// - Click on hotspot shows detail panel
// - Keyboard accessible
```

**Implementation File**: `src/components/lesson/InteractiveDiagram.tsx`

#### 4. Section Navigation Component (Test First)

**Test File**: `src/components/lesson/__tests__/SectionNav.test.tsx`

```typescript
// Tests:
// - Displays progress dots for sections
// - Previous/Next buttons navigate
// - Keyboard arrows navigate
// - Current section highlighted
```

**Implementation File**: `src/components/lesson/SectionNav.tsx`

#### 5. Text Lesson Page (Test First)

**Test File**: `src/app/(app)/lesson/__tests__/text/[lessonId]/page.test.tsx`

```typescript
// Tests:
// - Loads text lesson from Firestore
// - Renders content with dual coding
// - Section navigation works
// - Progress tracked by section
// - End-of-lesson comprehension quiz
```

**Implementation Files**:
- Update `src/app/(app)/lesson/[lessonId]/page.tsx` to handle text type
- Add text-specific components

### Acceptance Criteria Tests
- [ ] Markdown renders correctly
- [ ] Math equations display properly (KaTeX)
- [ ] Code blocks have syntax highlighting
- [ ] Layout responsive (split → stack on mobile)
- [ ] Section navigation functional
- [ ] Interactive diagram hotspots work
- [ ] Progress saves per section

---

## Implementation Order

### Week 1
1. **Day 1-2**: SHA-274 (Schema + Types + Seed)
2. **Day 3-4**: SHA-279 (Progress Tracking)
3. **Day 5**: SHA-276 (Subject Navigation)

### Week 2
4. **Day 1-3**: SHA-277 (Video Player)
5. **Day 4-5**: SHA-278 (Text Renderer)

---

## Running Tests

```bash
# Start Firestore emulator
firebase emulators:start --only firestore,auth

# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm run test src/lib/firebase/__tests__/courses.test.ts

# Run tests with coverage
npm run test:coverage
```

---

## Linear Status Updates

As each sub-issue is completed:

1. Run all tests for that issue
2. Ensure all acceptance criteria pass
3. Update Linear issue status to "Done"
4. Commit code with issue reference: `git commit -m "SHA-XXX: Description"`

---

## Notes

- All course content and schema live in Firebase Firestore
- Use Firestore emulator for all testing (no production writes)
- Follow existing code patterns from `src/lib/firebase/firestore.ts`
- Types must be compatible with existing `UserProfile` structure
- Progress integrates with existing XP/gamification system

