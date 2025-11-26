# QuantumLearn MVP: Technical Design Document
## AI Tutor Platform for Year 9 Students - Minimum Viable Product

**Version**: 1.0  
**Target Audience**: Year 9 UK student (ages 13-14)  
**Development Timeline**: 6-8 weeks  
**Tech Stack**: Next.js 15, React 18, Firebase, Firebase GenKit

---

## Executive Summary

This MVP focuses on delivering **core evidence-based learning functionality** that provides immediate educational value while establishing the foundation for future features. Social and collaborative features are deferred to post-MVP iterations.

### MVP Goals
1. **Deliver effective learning** using spaced repetition and active recall
2. **Engage through basic gamification** (XP, levels, achievements)
3. **Provide AI-powered assistance** for real-time help
4. **Track meaningful progress** across Year 9 curriculum
5. **Establish scalable architecture** for future expansion

### What's In MVP
✅ Authentication & user profiles  
✅ Course catalog (all 12 Year 9 subjects)  
✅ Video lessons with embedded quizzes  
✅ Spaced repetition review system  
✅ Practice mode with immediate feedback  
✅ AI tutor chat assistant  
✅ Basic gamification (XP, levels, streaks)  
✅ Progress dashboard  
✅ Skill tree visualization  

### What's Deferred (Post-MVP)
❌ Social features (study groups, leaderboards, collaboration)  
❌ Parent dashboard  
❌ Advanced analytics & insights  
❌ Challenge/Boss Level mode  
❌ Avatar customization beyond basic selection  
❌ Quest-based narrative structures  
❌ Team challenges  
❌ Peer messaging  

---

## Information Architecture (MVP Simplified)

### Route Structure

```
/
├── (auth)
│   ├── /login
│   ├── /signup
│   └── /onboarding
│
├── (app) - Authenticated wrapper
│   ├── /dashboard
│   ├── /subjects
│   ├── /subjects/[subjectId]
│   ├── /lesson/[lessonId]
│   ├── /practice/[topicId]
│   ├── /review (spaced repetition)
│   ├── /tutor (AI chat)
│   ├── /progress
│   └── /settings
```

**Total Pages**: 11 core pages (vs. 20+ in full design)

---

## MVP Pages - Detailed Specifications

### 1. Onboarding Flow (`/onboarding`)

**Purpose**: Quickly get student learning with minimal friction

**Steps** (3-step simplified wizard):

#### Step 1: Welcome + Avatar Selection
- **Heading**: "Welcome to QuantumLearn!"
- **Subheading**: "Choose your learning companion"
- **Avatar Grid**: 8 preset avatars (no customization in MVP)
  - 4 characters × 2 color variants
  - Simple illustrations (can use Dicebear API or similar)
- **Input**: Student name
- **CTA**: "Next"

#### Step 2: Quick Diagnostic (10 minutes)
- **Heading**: "Let's see where you are"
- **Subheading**: "Answer 20 questions across different subjects"
- **Adaptive Quiz**:
  - 2-3 questions per core subject (Maths, English, Science, French)
  - Difficulty adjusts based on answers
  - Multiple choice for speed
  - Progress bar showing 1-20
- **Algorithm**: Simple IRT (Item Response Theory)
  - Start at medium difficulty
  - Correct → harder question
  - Incorrect → easier question
  - Track mastery per subject (0-100%)

#### Step 3: Set Your Goals
- **Daily Study Goal**: Slider (15, 30, 45, 60 minutes)
- **Subject Priorities**: Toggle which subjects to focus on first
- **Notification Preferences**: 
  - Daily reminders (yes/no + time)
  - Review alerts (yes/no)
- **Accessibility Quick Setup**:
  - Font size (S/M/L)
  - High contrast mode (toggle)
- **CTA**: "Start Learning"

**Completion**: Redirect to dashboard with welcome tooltip tour

---

### 2. Dashboard (`/dashboard`)

**Layout**: Single-column on mobile, two-column on desktop

#### Header Section
- **Left**: 
  - Greeting: "Good morning, [Name]!"
  - Current streak: "🔥 3 day streak"
- **Right**:
  - XP bar: "Level 5 | 380/500 XP"
  - Avatar thumbnail

#### Today's Focus Card (Priority #1)
- **Title**: "Your Mission Today"
- **AI-Generated Plan**:
  - "1. Review 12 overdue cards (10 min)"
  - "2. Complete Maths: Pythagoras Theorem (15 min)"
  - "3. Practice French vocabulary (5 min)"
- **Total Time**: "~30 minutes"
- **CTA**: "Start Now" → routes to first activity
- **Visual**: Simple checklist with time estimates

#### Spaced Review Alert (If cards due)
- **Badge**: Red notification dot
- **Text**: "12 cards ready for review"
- **Subjects**: Badges showing which subjects (Math x5, French x4, Science x3)
- **CTA**: "Review Now" → `/review`
- **Visual**: Stack of cards illustration

#### Continue Learning Carousel
- **Horizontal scroll** (3 visible, more hidden)
- Each card:
  - Thumbnail image
  - Subject badge
  - Lesson title
  - Progress ring (% complete)
  - Duration estimate
  - "Continue" button
- **Empty State**: "Explore Subjects" link

#### Quick Stats Grid (3 columns on desktop, 1 on mobile)
- **Study Time This Week**: "2h 45m" with bar chart
- **Lessons Completed**: "8 lessons" with icon
- **Current Streak**: "3 days" with flame icon

#### Skill Tree Minimap
- **Title**: "Your Progress Map"
- **Visual**: Simplified view showing 12 subject nodes
- **Color Coding**:
  - Grey: Not started (locked)
  - Blue: In progress
  - Green: Proficient (70%+)
  - Gold: Mastered (90%+)
- **Interactive**: Click node → go to subject page
- **CTA**: "View Full Tree"

---

### 3. Subjects Index (`/subjects`)

**Purpose**: Browse all Year 9 subjects

**Layout**: Grid of subject cards

#### Subject Card (12 total)
- **Visual**: Subject icon/illustration
- **Title**: Subject name
- **Subtitle**: "Year 9 • Key Stage 3"
- **Progress Ring**: Overall completion %
- **Stats**:
  - "12/20 modules"
  - "Level 3"
- **CTA**: "Continue" or "Start"

**Subjects List**:
1. Mathematics
2. English Language & Literature
3. Biology
4. Chemistry
5. Physics
6. French (CFM track)
7. History
8. Geography
9. Computing
10. Religious Studies
11. Art & Design
12. Physical Education

**Filtering** (MVP: Simple toggle):
- "All" | "In Progress" | "Not Started"

---

### 4. Subject Detail (`/subjects/[subjectId]`)

**Example**: `/subjects/mathematics`

#### Header
- **Back Button**: "← All Subjects"
- **Subject Icon**: Large centered
- **Title**: "Mathematics"
- **Subtitle**: "Year 9 Key Stage 3"
- **Mastery Bar**: "42% Mastered"
- **Level Badge**: "Level 3"

#### Skill Tree (MVP: Simplified Linear View)

**Why Linear?**: Complex interactive tree is time-intensive; defer to post-MVP

**Alternative**: **Module Accordion**
- Vertical list of modules
- Each module expandable to show lessons
- Visual connection lines showing prerequisites

**Module Card**:
- **Status Icon**: 
  - 🔒 Locked (prerequisites not met)
  - ▶️ Available
  - ⏸️ In Progress
  - ✅ Completed
- **Title**: "Module 1: Number Operations"
- **Description**: Short summary (1 line)
- **Stats**:
  - Lessons: "5/8 completed"
  - Time: "~45 minutes remaining"
  - Mastery: Progress bar
- **CTA**: "Continue" or "Start"

**Lessons List** (when module expanded):
- Indented under module
- Each lesson:
  - Type icon (video, quiz, practice)
  - Title
  - Duration
  - Status: Not started / In progress / Complete

**Example Structure**:
```
Mathematics
├── Module 1: Number Operations
│   ├── Lesson 1: Order of Operations (12 min) ✅
│   ├── Lesson 2: Fractions & Decimals (10 min) ✅
│   ├── Practice: Mixed Operations (15 min) ▶️
│   └── Review Quiz (5 min) 🔒
├── Module 2: Algebra Basics
│   ├── Lesson 1: Variables & Expressions (10 min) 🔒
│   └── ...
```

#### Bottom CTA
- "Continue Next Lesson" → routes to next incomplete lesson

---

### 5. Lesson Player (`/lesson/[lessonId]`)

**Purpose**: Immersive content consumption

**Layout**: Full-screen with minimal chrome

#### Top Bar (Fixed, semi-transparent)
- **Left**: Back button (← returns to subject)
- **Center**: Lesson title + progress (e.g., "Section 2 of 5")
- **Right**: Settings icon (speed, captions)

#### Content Area (Responsive to lesson type)

**Lesson Type: Video**

**Video Player**:
- Custom HTML5 video element
- Controls:
  - Play/Pause (spacebar)
  - Progress bar (seekable)
  - Speed: 0.75x, 1x, 1.25x, 1.5x
  - Captions toggle (English captions mandatory)
  - Fullscreen
  - Volume
- **Embedded Questions**:
  - Video pauses at predetermined timestamps
  - Question overlay appears
  - Must answer to continue (or skip with confirmation)
  - Immediate feedback shown
  - Video resumes after answer

**Transcript Panel** (Collapsible sidebar on desktop, bottom sheet on mobile):
- Full text transcript
- Auto-scroll synchronized with video
- Clickable timestamps → jump to video time
- Search functionality
- Copy text enabled

**Lesson Type: Text + Visual**

**Split Layout**:
- **Left 50%**: Text content
  - Markdown rendering
  - LaTeX math support (KaTeX)
  - Clear typography
  - Chunked into sections (3-5 per lesson)
- **Right 50%**: Visual aids
  - Diagrams, infographics, animations
  - Interactive elements (hover states)
  - Synchronized with text scroll

**Navigation**: 
- "Previous Section" / "Next Section" buttons
- Keyboard: Arrow keys
- Progress dots showing current section

**Lesson Type: Interactive Simulation**

**Embedded iframe** or React component:
- PhET simulation embed (where applicable)
- Custom D3.js visualizations
- Interactive diagrams (e.g., circuit builder, geometry manipulator)

**Guidance Panel** (overlay):
- Instructions: "Try changing the angle..."
- Objectives: "Observe how X affects Y"
- Challenge: "Can you make Z happen?"

#### Bottom Action Bar (Fixed)

**During Lesson**:
- "Need Help?" button → Opens AI tutor drawer from right

**End of Lesson**:
- **Quick Check**: 3-5 comprehension questions
  - Immediate feedback
  - Explanation for each
- **Self-Assessment**: "How confident are you with this material?"
  - Slider: Not confident → Very confident
  - Affects SRS scheduling
- **XP Reward**: Animated +50 XP
- **CTA**: "Continue to Next Lesson" or "Back to Subject"

---

### 6. Practice Mode (`/practice/[topicId]`)

**Purpose**: Active recall practice with immediate feedback

**Header**:
- Topic title: "Algebra: Solving Linear Equations"
- Progress: "Question 5 of 15"
- Timer: "3:45 elapsed" (non-pressure, informational only)

#### Question Display

**Question Text**:
- Clear formatting
- LaTeX rendering for math
- Image support
- Code blocks (for Computing)

**Answer Input** (varies by type):

**Multiple Choice**:
- Radio buttons
- 4 options (A, B, C, D)
- Keyboard shortcuts (1, 2, 3, 4)

**Short Answer**:
- Text input field
- Math input support (simple parser or MathQuill for MVP)
- French: Accented character keyboard helper

**True/False**:
- Two large buttons

**Fill in the Blank**:
- Inline text input(s)

**Submit Button**: Large, clear CTA

#### Feedback Panel (After submission)

**If Correct**:
- ✅ Green checkmark animation
- "Correct!" message
- Brief explanation (optional, can be just confirmation)
- +10 XP animation
- "Next Question" button (auto-advances in 2 seconds)

**If Incorrect**:
- ❌ Red X (no harsh sound)
- "Not quite" message (positive framing)
- **Explanation**:
  - Why the answer is incorrect
  - Show correct answer
  - Conceptual explanation
  - Link to relevant lesson: "Review this in Lesson 3"
- **Similar Problem Offer**: "Want to try a similar problem?"
- "Next Question" button

#### Right Sidebar (Desktop) / Bottom Sheet (Mobile)

**Stats**:
- Accuracy: "80% correct (12/15)"
- Speed: "Average 45s per question"
- Streak: "5 in a row! 🔥"
- XP Earned: "+120 XP this session"

**AI Tutor Quick Access**:
- "Need help?" button
- Opens chat drawer

#### Session Complete

**Summary Screen**:
- Total questions: 15
- Correct: 12 (80%)
- Time: 11:23
- XP Earned: +150 XP
- **Weak Areas Identified**: "You struggled with quadratic equations"
- **Recommendations**:
  - "Review Lesson 5: Quadratic Basics"
  - "Practice 10 more quadratic problems"
- **CTA**: "Done" or "Practice More"

---

### 7. Spaced Repetition Review (`/review`)

**Purpose**: Review due flashcards using SRS algorithm

#### Landing Screen (if cards due)

**Header**:
- "Time to Review!"
- Subtitle: "Keep your knowledge fresh"

**Cards Due Summary**:
- Total: "18 cards due today"
- By subject (with badges):
  - Mathematics: 7 cards
  - French: 5 cards
  - Science: 4 cards
  - History: 2 cards
- Estimated time: "~15 minutes"
- **CTA**: "Start Review Session"

**Options**:
- Review all subjects (default)
- Filter by subject (dropdown)
- Review urgency only: "Overdue cards first"

#### Review Session Interface

**Card Display** (centered, large):

**Front Side** (Question):
- Clear question text
- Subject badge (top-right)
- Card number: "Card 3 of 18"
- **CTA**: "Show Answer" button
- **Secondary**: "I Don't Know" link

**Back Side** (Answer revealed):
- Question remains visible (top, smaller)
- Answer shown prominently
- Explanation (if applicable)
- Source reference: "From Lesson: Pythagoras Theorem"

**Self-Assessment Buttons** (bottom, large):
```
┌─────────┬─────────┬─────────┬─────────┐
│  Again  │  Hard   │  Good   │  Easy   │
│   <1d   │   3d    │   7d    │  14d    │
└─────────┴─────────┴─────────┴─────────┘
```

- **Again**: Didn't know it → review tomorrow
- **Hard**: Struggled → review in 3 days
- **Good**: Got it → review in 7 days
- **Easy**: Knew immediately → review in 14 days

**Tooltips** (on hover):
- Explain what each rating means
- Show next review date

**Keyboard Shortcuts**:
- Spacebar: Show answer
- 1, 2, 3, 4: Rating buttons

#### Progress Indicators

**Top Bar**:
- Progress bar: "3 of 18 reviewed"
- Time elapsed: "4:32"
- Session accuracy (ongoing)

#### Session Complete

**Summary**:
- Cards reviewed: 18
- Time spent: 12:45
- Accuracy: "83% rated Good or Easy"
- Streak maintained: "4 days! 🔥"
- XP earned: +90 XP
- **Next review**: "12 cards due tomorrow"

**Visual**: Calendar preview showing upcoming review days

**CTA**: "Back to Dashboard"

#### Empty State (No cards due)

**Message**: "All caught up! 🎉"
**Subtext**: "No reviews due right now. Come back tomorrow!"
**Next Due**: "3 cards due tomorrow at 9:00 AM"
**Alternative Action**: "Want to practice instead?" → link to practice mode

---

### 8. AI Tutor Chat (`/tutor`)

**Purpose**: Get help with concepts via conversational AI

**Layout**: Full-page chat interface

#### Left Sidebar (Desktop only, 25% width)

**Recent Conversations**:
- List of past 10 conversations
- Each item:
  - Date/time
  - First message preview
  - Subject badge
  - Click to load conversation
- **CTA**: "+ New Conversation"

**Quick Actions**:
- "Explain a concept"
- "Check my work"
- "Generate practice problems"
- "Help with homework"

#### Main Chat Area (75% width, full on mobile)

**Header**:
- "QuantumLearn Tutor"
- Animated avatar (subtle, not distracting)
- Status: "Online • Responds in seconds"

**Conversation Thread** (scrollable):

**AI Messages** (left-aligned):
- Avatar thumbnail
- Message bubble (light background)
- Timestamp
- **Rich Content Support**:
  - Text with markdown
  - LaTeX math: `$$E = mc^2$$` (rendered)
  - Code blocks with syntax highlighting
  - Embedded images
  - Links to lessons: "Review [Lesson 5](#)"
- **Action Buttons** (below message):
  - 👍 Helpful / 👎 Not helpful
  - "Explain differently"
  - "Show example"

**User Messages** (right-aligned):
- Blue bubble
- Timestamp

**Socratic Design** (AI behavior):
- **Don't give direct answers** to homework
- Ask guiding questions: "What have you tried so far?"
- Break down complex problems: "Let's start with step 1..."
- Encourage thinking: "What do you think would happen if...?"
- Provide hints, not solutions
- Offer worked examples for similar problems

#### Input Area (Bottom, fixed)

**Text Input**:
- Large textarea
- Placeholder: "Ask me anything about Year 9 subjects..."
- Auto-expanding (up to 5 lines)
- Character count (subtle)

**Quick Suggestion Chips** (above input, if empty):
- "Explain [current topic]"
- "I'm stuck on this problem"
- "Can you quiz me?"
- "Show me an example"

**Send Button**: 
- Right side
- Keyboard: Ctrl/Cmd + Enter

**Additional Controls**:
- Attach image (optional in MVP, defer if complex)
- Voice input (defer to post-MVP)

#### Context Awareness

**AI knows**:
- Current lesson (if coming from lesson player)
- Recent topics studied
- Weak areas from practice
- Student's mastery level per subject

**Example Contextual Greeting**:
> "Hi! I see you just completed the lesson on Pythagoras Theorem. Want to practice some problems or have questions about it?"

#### Safety & Limitations

**Content Moderation**:
- Filter inappropriate requests
- Refuse to do homework directly
- Encourage independent thinking

**Fallback Messages**:
- "I'm not sure about that. Let me point you to [resource]."
- "That's beyond Year 9 curriculum, but I can explain the basics."
- "For personal advice, please talk to a teacher or parent."

**Rate Limiting** (MVP: generous):
- 50 messages per day
- Notice at 40: "10 messages remaining today"

---

### 9. Progress Dashboard (`/progress`)

**Purpose**: Visualize learning analytics

**Header**:
- "Your Progress"
- Date range selector: "Last 7 days" | "Last 30 days" | "All time"

#### Overview Cards (4-column grid, responsive)

**Study Time**:
- Large number: "8h 32m"
- Subtitle: "this week"
- Comparison: "↑ 15% vs. last week"
- Icon: Clock

**Lessons Completed**:
- Number: "24"
- Subtitle: "lessons finished"
- Icon: Checkmark

**Practice Questions**:
- Number: "346"
- Subtitle: "questions answered"
- Accuracy: "82% correct"
- Icon: Target

**Current Streak**:
- Number: "5 days"
- Subtitle: "current streak"
- Best: "Longest: 12 days"
- Icon: Flame

#### Subject Mastery Chart

**Visual**: Horizontal bar chart
- Y-axis: 12 subjects
- X-axis: Mastery % (0-100%)
- Color-coded bars:
  - 0-30%: Red (needs attention)
  - 30-70%: Yellow (in progress)
  - 70-90%: Blue (proficient)
  - 90-100%: Gold (mastered)
- Hover: Show exact percentage + lessons completed

**Top Subjects**:
- Quick callout: "You're excelling in Science (82%) and French (78%)"

**Needs Attention**:
- Warning: "Mathematics needs more practice (34%)"

#### Study Time Breakdown

**Visual**: Stacked area chart or line chart
- X-axis: Last 30 days
- Y-axis: Minutes studied
- Multiple lines for subjects (top 5, others grouped)
- Toggle subjects on/off
- Hover: See exact time per day

**Insight Card**:
- "You study most on Tuesday evenings"
- "Your longest session: 45 minutes on [date]"

#### Consistency Calendar

**Visual**: GitHub-style heatmap
- 12 weeks visible
- Each square = one day
- Color intensity = study time
  - White: 0 min
  - Light green: 1-15 min
  - Medium green: 16-30 min
  - Dark green: 31+ min
- Hover: Show date + time
- Click: Jump to that day's activities

#### Recent Activity Feed (Bottom section)

**Timeline List**:
- Last 20 activities
- Each item:
  - Icon (lesson/practice/review)
  - Description: "Completed Maths: Pythagoras"
  - Time ago: "2 hours ago"
  - XP earned: "+50 XP"

**Load More**: Pagination for older activities

---

### 10. Settings (`/settings`)

**Purpose**: Customize experience

**Layout**: Two-column (sidebar nav + content)

#### Sidebar Navigation (Desktop) / Top Tabs (Mobile)
- Profile
- Learning
- Notifications
- Accessibility
- Account

---

#### Tab: Profile

**Avatar**:
- Current avatar displayed
- **Change Avatar**: Opens modal with 8 preset options
- No custom upload in MVP

**Personal Info**:
- Name (editable)
- Email (display only)
- School: "Hayes Secondary School" (optional)
- Year: "Year 9" (fixed for MVP)

**Stats Summary** (read-only):
- Member since: [date]
- Total XP: 2,450
- Current level: 5

---

#### Tab: Learning

**Daily Study Goal**:
- Slider: 15 / 30 / 45 / 60 / 90 minutes
- Default: 30 minutes
- Shows as: "30 minutes per day"

**Review Schedule Intensity**:
- Radio buttons:
  - Relaxed: More spacing between reviews
  - Normal: Balanced (default)
  - Aggressive: Frequent reviews for faster mastery
- Tooltip explaining each

**Subject Priorities**:
- Checkboxes for 12 subjects
- All checked by default
- Unchecked subjects hidden from "Today's Mission"
- Warning: "At least 3 subjects recommended"

**Auto-Pla
