# Functional Test Plan: SHA-273 - Phase 2: Core Learning Content Delivery System

**Epic:** SHA-273  
**Status:** Ready for Testing  
**Test Type:** Functional / End-to-End  
**Execution:** Manual or Automated (Playwright)

---

## Test Environment Setup

### Prerequisites
1. Firebase emulators running (Firestore, Auth)
2. Test user account created and authenticated
3. Sample course data seeded (3 subjects: Math, English, French)
4. Application running in development mode

### Test Data Requirements
- Authenticated test user
- At least 3 courses seeded (one per subject: Math, English, French)
- Each course should have:
  - At least 1 module
  - At least 1 video lesson with embedded questions
  - At least 1 text lesson with sections and visuals
  - Comprehension check questions

---

## Test Suite 1: SHA-274 - Firestore Course Schema

### TC-274-01: Verify Course Data Structure
**Objective:** Verify that course data is properly structured in Firestore

**Preconditions:**
- Firebase emulator running
- Seed script executed

**Test Steps:**
1. Navigate to Firebase Emulator UI (http://localhost:4000)
2. Open Firestore Data tab
3. Navigate to `courses` collection
4. Verify at least 3 course documents exist
5. For each course document, verify:
   - Contains `id`, `subjectId`, `title`, `description`, `icon`
   - Contains `modules` array
   - Each module contains `lessons` array
   - Each lesson has `type` field (video/text/simulation)
   - Video lessons contain `content.videoUrl`, `content.transcript`
   - Text lessons contain `content.markdown`, `content.sections`
   - Lessons contain `embeddedQuestions` array
   - Lessons contain `comprehensionCheck` array

**Expected Results:**
- ✅ All 3 sample subjects (Math, English, French) exist
- ✅ Course structure matches TypeScript types
- ✅ All lesson types (video, text) are supported
- ✅ Embedded questions and comprehension checks are present

**Acceptance Criteria Alignment:**
- ✅ Firestore schema documented
- ✅ TypeScript types match schema
- ✅ Seed script creates 3 sample subjects
- ✅ Data structure supports all lesson types

---

### TC-274-02: Verify Security Rules
**Objective:** Verify Firestore security rules allow authenticated users to read courses

**Preconditions:**
- Firebase emulator running
- Authenticated test user

**Test Steps:**
1. As authenticated user, attempt to read courses collection
2. Verify read access is granted
3. As authenticated user, attempt to write to courses collection
4. Verify write access is denied (only server-side writes allowed)

**Expected Results:**
- ✅ Authenticated users can read courses
- ✅ Authenticated users cannot write courses directly
- ✅ Unauthenticated users cannot read courses

**Acceptance Criteria Alignment:**
- ✅ Security rules defined

---

## Test Suite 2: SHA-276 - Subject Navigation Pages

### TC-276-01: Verify Subjects Index Page - All Subjects Displayed
**Objective:** Verify all 12 subjects are listed on the subjects index page

**Preconditions:**
- User authenticated
- Navigate to `/subjects`

**Test Steps:**
1. Navigate to `/subjects` page
2. Verify page title displays "Subjects"
3. Count number of subject cards displayed
4. Verify each subject card shows:
   - Subject icon
   - Subject name
   - Progress percentage
   - Level indicator
   - "Start" or "Continue" button

**Expected Results:**
- ✅ All 12 subjects are displayed:
  - Mathematics, English Language & Literature, Biology, Chemistry, Physics
  - French, History, Geography, Computing, Religious Studies
  - Art & Design, Physical Education
- ✅ Each subject card displays all required information
- ✅ Progress percentages are displayed (0-100%)

**Acceptance Criteria Alignment:**
- ✅ All 12 subjects listed on index

---

### TC-276-02: Verify Subject Filtering
**Objective:** Verify filter functionality works correctly

**Preconditions:**
- User authenticated
- Navigate to `/subjects`
- Some subjects have progress > 0%, some have 0%

**Test Steps:**
1. Click "All" filter tab
2. Verify all subjects are displayed
3. Click "In Progress" filter tab
4. Verify only subjects with progress > 0% and < 100% are displayed
5. Click "Not Started" filter tab
6. Verify only subjects with progress = 0% are displayed

**Expected Results:**
- ✅ "All" shows all subjects
- ✅ "In Progress" shows only subjects with 0% < progress < 100%
- ✅ "Not Started" shows only subjects with 0% progress
- ✅ Filter state persists when switching tabs

**Acceptance Criteria Alignment:**
- ✅ Filter: All / In Progress / Not Started

---

### TC-276-03: Verify Subject Detail Page - Modules and Lessons
**Objective:** Verify subject detail page displays modules and lessons correctly

**Preconditions:**
- User authenticated
- Navigate to `/subjects/[subjectId]` (e.g., `/subjects/mathematics`)

**Test Steps:**
1. Navigate to a subject detail page
2. Verify subject header displays:
   - Subject name
   - Subject icon
   - "Year 9 Key Stage 3" text
   - Overall progress bar with percentage
3. Verify modules are displayed in accordion format
4. For each module, verify:
   - Module title
   - Module status icon (completed/in-progress/locked)
   - Number of lessons indicator
   - Expandable/collapsible functionality
5. Expand a module
6. Verify lessons are listed with:
   - Lesson title
   - Lesson type icon (video/text/practice)
   - Lesson duration
   - Lesson status icon (completed/in-progress/locked)

**Expected Results:**
- ✅ Subject header displays correctly
- ✅ Overall progress percentage is accurate
- ✅ All modules are displayed
- ✅ Modules can be expanded/collapsed
- ✅ Lessons are listed under each module
- ✅ Lesson status indicators are correct

**Acceptance Criteria Alignment:**
- ✅ Subject detail shows modules and lessons

---

### TC-276-04: Verify Prerequisites Enforcement (Locked State)
**Objective:** Verify lessons are locked when prerequisites are not met

**Preconditions:**
- User authenticated
- Navigate to `/subjects/[subjectId]`
- Course has prerequisites configured

**Test Steps:**
1. Navigate to a subject with prerequisites
2. Identify a lesson that requires prerequisites
3. Verify lesson displays locked icon
4. Verify lesson is not clickable
5. Complete prerequisite lesson
6. Refresh page
7. Verify previously locked lesson is now unlocked

**Expected Results:**
- ✅ Lessons with unmet prerequisites show locked state
- ✅ Locked lessons cannot be accessed
- ✅ After completing prerequisites, lessons unlock
- ✅ Locked state is visually distinct (opacity, icon)

**Acceptance Criteria Alignment:**
- ✅ Prerequisites enforced (locked state)

---

### TC-276-05: Verify Responsive Design
**Objective:** Verify subjects pages are responsive on all devices

**Preconditions:**
- User authenticated
- Browser DevTools available

**Test Steps:**
1. Navigate to `/subjects` page
2. Test on mobile viewport (375x667):
   - Verify grid shows 1 column
   - Verify subject cards stack vertically
   - Verify all content is readable
   - Verify buttons are tappable
3. Test on tablet viewport (768x1024):
   - Verify grid shows 2 columns
   - Verify layout adapts appropriately
4. Test on desktop viewport (1920x1080):
   - Verify grid shows 3 columns
   - Verify optimal use of space
5. Repeat steps 1-4 for `/subjects/[subjectId]` page

**Expected Results:**
- ✅ Mobile: 1 column layout, stacked cards
- ✅ Tablet: 2 column layout
- ✅ Desktop: 3 column layout
- ✅ All interactive elements accessible on all devices
- ✅ Text remains readable on all screen sizes

**Acceptance Criteria Alignment:**
- ✅ Responsive on all devices

---

## Test Suite 3: SHA-277 - Video Lesson Player

### TC-277-01: Verify Video Player Controls
**Objective:** Verify all video player controls function correctly

**Preconditions:**
- User authenticated
- Navigate to a video lesson page

**Test Steps:**
1. Navigate to a video lesson (e.g., `/lesson/[lessonId]`)
2. Verify video player is displayed
3. Test play/pause button:
   - Click play button, verify video starts
   - Click pause button, verify video pauses
4. Test seek bar:
   - Drag seek bar to different position
   - Verify video jumps to new position
5. Test volume control:
   - Click mute button, verify audio mutes
   - Adjust volume slider, verify volume changes
6. Test playback speed:
   - Change speed to 1.25x, verify video plays faster
   - Change speed to 0.75x, verify video plays slower
7. Test fullscreen:
   - Click fullscreen button, verify video enters fullscreen
   - Press ESC or click exit fullscreen, verify video exits fullscreen
8. Test captions (if available):
   - Click CC button, verify captions appear
   - Click CC button again, verify captions hide

**Expected Results:**
- ✅ Play/pause works correctly
- ✅ Seek bar allows jumping to any position
- ✅ Volume control works (mute and slider)
- ✅ Playback speed changes (0.75x, 1x, 1.25x, 1.5x)
- ✅ Fullscreen toggle works
- ✅ Captions toggle works (if captions available)

**Acceptance Criteria Alignment:**
- ✅ Video plays smoothly on all devices

---

### TC-277-02: Verify Keyboard Shortcuts
**Objective:** Verify keyboard shortcuts work for video control

**Preconditions:**
- User authenticated
- Video lesson page open
- Video player has focus

**Test Steps:**
1. Press SPACEBAR, verify video toggles play/pause
2. Press LEFT ARROW, verify video seeks backward 10 seconds
3. Press RIGHT ARROW, verify video seeks forward 10 seconds
4. Press UP ARROW, verify volume increases
5. Press DOWN ARROW, verify volume decreases
6. Press F key, verify fullscreen toggles

**Expected Results:**
- ✅ Spacebar toggles play/pause
- ✅ Left arrow seeks backward 10s
- ✅ Right arrow seeks forward 10s
- ✅ Up arrow increases volume
- ✅ Down arrow decreases volume
- ✅ F key toggles fullscreen

**Acceptance Criteria Alignment:**
- ✅ Keyboard shortcuts (space, arrows)

---

### TC-277-03: Verify Embedded Questions
**Objective:** Verify embedded questions pause video and require answers

**Preconditions:**
- User authenticated
- Video lesson with embedded questions at specific timestamps
- Video lesson page open

**Test Steps:**
1. Start video playback
2. Let video play until embedded question timestamp
3. Verify:
   - Video automatically pauses
   - Question modal appears
   - Question text is displayed
   - Answer options are shown (for multiple choice)
4. Select an answer
5. Click "Submit Answer"
6. Verify:
   - Feedback is shown (correct/incorrect)
   - Explanation is displayed
7. Click "Continue"
8. Verify:
   - Modal closes
   - Video resumes playback

**Expected Results:**
- ✅ Video pauses automatically at question timestamp
- ✅ Question modal displays correctly
- ✅ All question types work (multiple-choice, true/false, short-answer)
- ✅ Answer submission shows immediate feedback
- ✅ Video resumes after answering

**Acceptance Criteria Alignment:**
- ✅ Embedded questions work correctly

---

### TC-277-04: Verify Synchronized Transcript
**Objective:** Verify transcript panel syncs with video playback

**Preconditions:**
- User authenticated
- Video lesson with transcript
- Video lesson page open

**Test Steps:**
1. Click "Show Transcript" button
2. Verify transcript panel appears
3. Start video playback
4. Verify:
   - Active segment highlights as video plays
   - Transcript auto-scrolls to active segment
   - Highlighted segment matches current video time
5. Click on a transcript segment
6. Verify:
   - Video seeks to that segment's timestamp
   - Video continues playing from that point

**Expected Results:**
- ✅ Transcript panel displays correctly
- ✅ Active segment highlights during playback
- ✅ Transcript auto-scrolls to active segment
- ✅ Clicking transcript segments seeks video

**Acceptance Criteria Alignment:**
- ✅ Transcript synchronized

---

### TC-277-05: Verify Progress Saving and Resume
**Objective:** Verify video progress saves and resumes correctly

**Preconditions:**
- User authenticated
- Video lesson page open
- Video has been played partially

**Test Steps:**
1. Start video playback
2. Seek to position 2:30 (2 minutes 30 seconds)
3. Wait 5 seconds (to allow auto-save)
4. Close browser tab/window
5. Reopen application and navigate to same lesson
6. Verify:
   - Video resumes from saved position (approximately 2:30)
   - Progress is maintained

**Alternative Test (Manual):**
1. Play video to 50% completion
2. Navigate away from lesson
3. Return to lesson
4. Verify video resumes from ~50% position

**Expected Results:**
- ✅ Video position saves automatically (every 30 seconds)
- ✅ Video resumes from last saved position
- ✅ Progress persists across sessions

**Acceptance Criteria Alignment:**
- ✅ Progress saves and resumes

---

### TC-277-06: Verify Comprehension Quiz
**Objective:** Verify end-of-lesson comprehension quiz works

**Preconditions:**
- User authenticated
- Video lesson with comprehension check questions
- Video lesson page open

**Test Steps:**
1. Play video to completion (or skip to end)
2. Verify comprehension quiz appears automatically
3. Answer first question
4. Click "Next"
5. Answer remaining questions
6. Click "Submit Quiz" on last question
7. Verify:
   - Quiz results page displays
   - Score is shown (e.g., "8 / 10")
   - Percentage is displayed
   - Each question shows correct/incorrect status
   - Explanations are shown for each question
8. Click "Review Lesson" or close quiz
9. Verify lesson is marked as complete

**Expected Results:**
- ✅ Quiz appears at end of video
- ✅ All questions are displayed sequentially
- ✅ Answers can be selected/changed
- ✅ Quiz submission shows results
- ✅ Score calculation is accurate
- ✅ Lesson completion is recorded

**Acceptance Criteria Alignment:**
- ✅ Comprehension quiz (3-5 questions)

---

### TC-277-07: Verify XP Award on Completion
**Objective:** Verify XP is awarded when lesson is completed

**Preconditions:**
- User authenticated
- User profile shows current XP value
- Complete a video lesson

**Test Steps:**
1. Note current XP value from user profile/dashboard
2. Complete a video lesson (watch to end, complete quiz)
3. Verify XP reward animation appears (if implemented)
4. Check user profile/dashboard
5. Verify XP has increased

**Expected Results:**
- ✅ XP is awarded on lesson completion
- ✅ XP value updates in user profile
- ✅ XP reward animation displays (if implemented)

**Acceptance Criteria Alignment:**
- ✅ XP awarded on completion

---

## Test Suite 4: SHA-278 - Text Lesson Renderer

### TC-278-01: Verify Markdown Rendering
**Objective:** Verify markdown content renders correctly

**Preconditions:**
- User authenticated
- Navigate to a text lesson

**Test Steps:**
1. Navigate to a text lesson page
2. Verify markdown content renders:
   - Headings (H1, H2, H3) display with proper styling
   - Paragraphs display correctly
   - Lists (ordered and unordered) render properly
   - Links are clickable and styled
   - Bold and italic text render correctly
   - Code blocks display with syntax highlighting
   - Inline code displays with background

**Expected Results:**
- ✅ All markdown elements render correctly
- ✅ Typography is readable and well-styled
- ✅ Code blocks have syntax highlighting
- ✅ Links are functional

**Acceptance Criteria Alignment:**
- ✅ Markdown renders correctly

---

### TC-278-02: Verify LaTeX Math Equations
**Objective:** Verify math equations render using KaTeX

**Preconditions:**
- User authenticated
- Text lesson with LaTeX math expressions

**Test Steps:**
1. Navigate to a text lesson with math content
2. Verify inline math expressions render (e.g., $x = 5$)
3. Verify block math equations render (e.g., $$x = \frac{-b \pm \sqrt{b^2-4ac}}{2a}$$)
4. Verify equations are properly formatted and readable

**Expected Results:**
- ✅ Inline math expressions render correctly
- ✅ Block equations render correctly
- ✅ Math symbols and formulas display properly
- ✅ Equations are properly aligned

**Acceptance Criteria Alignment:**
- ✅ Math equations display properly

---

### TC-278-03: Verify Dual-Coded Layout (Responsive)
**Objective:** Verify layout adapts between split and stacked views

**Preconditions:**
- User authenticated
- Text lesson with visuals (dual-coded content)
- Browser DevTools available

**Test Steps:**
1. Navigate to a text lesson with visuals
2. Test desktop viewport (1920x1080):
   - Verify text content on left side
   - Verify visual content on right side
   - Verify both are visible simultaneously
3. Test tablet viewport (768x1024):
   - Verify layout adapts appropriately
4. Test mobile viewport (375x667):
   - Verify text content stacks on top
   - Verify visual content stacks below
   - Verify content is readable

**Expected Results:**
- ✅ Desktop: Split layout (text left, visual right)
- ✅ Mobile: Stacked layout (text top, visual bottom)
- ✅ Layout transitions smoothly between breakpoints
- ✅ All content remains accessible

**Acceptance Criteria Alignment:**
- ✅ Layout responsive (split → stack)

---

### TC-278-04: Verify Section Navigation
**Objective:** Verify section navigation works correctly

**Preconditions:**
- User authenticated
- Text lesson with multiple sections
- Navigate to text lesson page

**Test Steps:**
1. Verify section navigation panel is visible
2. Verify all sections are listed
3. Click on a section in navigation
4. Verify:
   - Page scrolls to that section
   - Section becomes active (highlighted)
   - Active section indicator updates
5. Scroll page manually
6. Verify active section updates based on scroll position
7. Test keyboard navigation:
   - Press DOWN ARROW, verify next section becomes active
   - Press UP ARROW, verify previous section becomes active

**Expected Results:**
- ✅ Section navigation panel displays all sections
- ✅ Clicking sections scrolls to correct position
- ✅ Active section highlights correctly
- ✅ Scroll position updates active section
- ✅ Keyboard navigation works (arrow keys)

**Acceptance Criteria Alignment:**
- ✅ Navigation between sections works

---

### TC-278-05: Verify Interactive Diagrams
**Objective:** Verify interactive diagrams with hotspots work

**Preconditions:**
- User authenticated
- Text lesson with interactive diagram

**Test Steps:**
1. Navigate to a text lesson with interactive diagram
2. Verify diagram image displays
3. Verify hotspot markers are visible on diagram
4. Click on a hotspot
5. Verify:
   - Tooltip appears with hotspot information
   - Tooltip shows title and description
   - Tooltip is positioned correctly
6. Click hotspot again
7. Verify tooltip closes
8. Click different hotspot
9. Verify tooltip updates to new hotspot information

**Expected Results:**
- ✅ Diagram displays correctly
- ✅ Hotspots are visible and clickable
- ✅ Tooltips show correct information
- ✅ Tooltips can be opened/closed
- ✅ Multiple hotspots work independently

**Acceptance Criteria Alignment:**
- ✅ Interactive elements functional

---

### TC-278-06: Verify Text Lesson Completion
**Objective:** Verify text lesson can be completed

**Preconditions:**
- User authenticated
- Text lesson with comprehension check

**Test Steps:**
1. Navigate to a text lesson
2. Scroll through all sections
3. Verify "Take Quiz" or "Mark Complete" button appears
4. Click button
5. If quiz exists:
   - Complete quiz
   - Verify results display
6. Verify lesson is marked as complete
7. Verify progress updates

**Expected Results:**
- ✅ Completion button appears
- ✅ Quiz can be completed (if present)
- ✅ Lesson completion is recorded
- ✅ Progress updates correctly

**Acceptance Criteria Alignment:**
- ✅ Interactive elements functional

---

## Test Suite 5: SHA-279 - Progress Tracking System

### TC-279-01: Verify Auto-Save Progress
**Objective:** Verify lesson progress saves automatically

**Preconditions:**
- User authenticated
- Video lesson page open

**Test Steps:**
1. Start video lesson
2. Play video for 1 minute
3. Wait 35 seconds (past auto-save interval of 30s)
4. Check Firestore emulator or network tab
5. Verify progress update was sent to server
6. Verify progress includes:
   - `timeSpent` updated
   - `lastPosition` updated (for video)
   - `status` set to "in_progress"

**Expected Results:**
- ✅ Progress saves automatically every 30 seconds
- ✅ Progress data includes time spent and position
- ✅ Status updates to "in_progress"

**Acceptance Criteria Alignment:**
- ✅ Progress saves automatically

---

### TC-279-02: Verify Completion Marks Persist
**Objective:** Verify completed lessons remain marked as complete

**Preconditions:**
- User authenticated
- Complete a lesson

**Test Steps:**
1. Complete a lesson (video or text)
2. Verify lesson shows completed status
3. Navigate away from lesson
4. Return to subject detail page
5. Verify lesson still shows completed status
6. Refresh page
7. Verify completion status persists
8. Log out and log back in
9. Verify completion status persists across sessions

**Expected Results:**
- ✅ Completion status persists after navigation
- ✅ Completion status persists after page refresh
- ✅ Completion status persists across sessions
- ✅ Completed lessons show correct visual indicator

**Acceptance Criteria Alignment:**
- ✅ Completion marks persist

---

### TC-279-03: Verify Resume Functionality
**Objective:** Verify video lessons resume from saved position

**Preconditions:**
- User authenticated
- Video lesson partially watched

**Test Steps:**
1. Play video lesson to position 3:45
2. Navigate away from lesson
3. Return to same lesson
4. Verify video resumes from approximately 3:45
5. Verify resume position is accurate (within 5 seconds)

**Expected Results:**
- ✅ Video resumes from saved position
- ✅ Resume position is accurate
- ✅ Resume works across sessions

**Acceptance Criteria Alignment:**
- ✅ Resume works (video timestamp saved)

---

### TC-279-04: Verify Progress Percentages Accuracy
**Objective:** Verify progress percentages are calculated correctly

**Preconditions:**
- User authenticated
- Course with multiple modules and lessons
- Some lessons completed

**Test Steps:**
1. Navigate to subject detail page
2. Note overall progress percentage
3. Complete one more lesson
4. Refresh page
5. Verify overall progress percentage increased
6. Verify module progress percentages update
7. Verify lesson progress percentages are accurate
8. Manually calculate expected progress:
   - Completed lessons / Total lessons * 100
9. Verify displayed percentage matches calculation

**Expected Results:**
- ✅ Overall progress percentage is accurate
- ✅ Module progress percentages are accurate
- ✅ Progress updates correctly when lessons completed
- ✅ Progress calculations match expected values

**Acceptance Criteria Alignment:**
- ✅ Progress percentages accurate

---

### TC-279-05: Verify Real-Time Updates Across Sessions
**Objective:** Verify progress updates reflect in real-time

**Preconditions:**
- User authenticated
- Two browser windows/tabs open
- Same user logged in both

**Test Steps:**
1. Open subject detail page in Window 1
2. Open same subject detail page in Window 2
3. Complete a lesson in Window 1
4. Verify Window 2 updates automatically (if real-time listeners implemented)
5. If not real-time, refresh Window 2
6. Verify progress updates in Window 2

**Expected Results:**
- ✅ Progress updates reflect across sessions
- ✅ Real-time updates work (if implemented)
- ✅ Manual refresh shows latest progress

**Acceptance Criteria Alignment:**
- ✅ Real-time updates across sessions

---

## Test Suite 6: End-to-End User Flows

### TC-E2E-01: Complete Video Lesson Flow
**Objective:** Verify complete user journey through a video lesson

**Preconditions:**
- User authenticated
- Fresh user session (no progress)

**Test Steps:**
1. Navigate to `/subjects`
2. Click on Mathematics subject
3. Verify subject detail page loads
4. Expand first module
5. Click on first video lesson
6. Verify lesson page loads
7. Start video playback
8. Answer embedded question when it appears
9. Continue watching video
10. Complete comprehension quiz at end
11. Verify lesson marked as complete
12. Navigate back to subject detail
13. Verify progress percentage increased
14. Verify next lesson is unlocked (if applicable)

**Expected Results:**
- ✅ Complete flow works end-to-end
- ✅ All features function correctly in sequence
- ✅ Progress updates correctly
- ✅ Next lesson unlocks if prerequisites met

---

### TC-E2E-02: Complete Text Lesson Flow
**Objective:** Verify complete user journey through a text lesson

**Preconditions:**
- User authenticated
- Fresh user session

**Test Steps:**
1. Navigate to `/subjects`
2. Click on a subject with text lessons
3. Click on a text lesson
4. Verify lesson page loads
5. Navigate through all sections using section nav
6. Interact with interactive diagrams (if present)
7. Complete comprehension quiz
8. Verify lesson marked as complete
9. Navigate back to subject detail
10. Verify progress updated

**Expected Results:**
- ✅ Complete text lesson flow works
- ✅ All sections accessible
- ✅ Interactive elements work
- ✅ Completion recorded correctly

---

## Test Execution Checklist

### Pre-Test Setup
- [ ] Firebase emulators started
- [ ] Test user account created
- [ ] Sample course data seeded
- [ ] Application running
- [ ] Browser DevTools available

### Test Execution
- [ ] SHA-274: Firestore Course Schema (2 tests)
- [ ] SHA-276: Subject Navigation Pages (5 tests)
- [ ] SHA-277: Video Lesson Player (7 tests)
- [ ] SHA-278: Text Lesson Renderer (6 tests)
- [ ] SHA-279: Progress Tracking System (5 tests)
- [ ] End-to-End Flows (2 tests)

### Post-Test
- [ ] All test results documented
- [ ] Defects logged (if any)
- [ ] Test report generated

---

## Playwright Test Script Structure

For automated execution, tests should be structured as:

```typescript
// Example structure (not full implementation)
test('TC-276-01: Verify Subjects Index Page', async ({ page }) => {
  await page.goto('/subjects');
  await expect(page.locator('h1')).toContainText('Subjects');
  // ... rest of test steps
});
```

---

## Notes

- **Test Data:** Ensure seed script creates consistent test data
- **Timing:** Some tests require waiting for auto-save intervals (30 seconds)
- **Cross-Browser:** Test on Chrome, Firefox, Safari, Edge
- **Mobile Testing:** Use responsive design mode or real devices
- **Accessibility:** Verify keyboard navigation and screen reader compatibility

---

## Defect Reporting

When defects are found, report with:
- Test Case ID
- Steps to reproduce
- Expected vs Actual results
- Screenshots/videos
- Browser/device information
- Console errors (if any)

---

**Document Version:** 1.0  
**Last Updated:** 2025-11-26  
**Author:** Test Team

