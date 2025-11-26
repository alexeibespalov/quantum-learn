# Functional Test Scripts for SHA-273

This directory contains functional test plans and scripts for the Phase 2: Core Learning Content Delivery System (SHA-273).

## Files

- **SHA-273_TEST_PLAN.md** - Comprehensive functional test plan with all test cases aligned to acceptance criteria
- **playwright-example.spec.ts** - Example Playwright test scripts for automated execution
- **README.md** - This file

## Test Plan Overview

The test plan covers all sub-issues of SHA-273:

1. **SHA-274**: Firestore Course Schema (2 test cases)
2. **SHA-276**: Subject Navigation Pages (5 test cases)
3. **SHA-277**: Video Lesson Player (7 test cases)
4. **SHA-278**: Text Lesson Renderer (6 test cases)
5. **SHA-279**: Progress Tracking System (5 test cases)
6. **End-to-End Flows** (2 test cases)

**Total: 27 test cases**

## Execution Methods

### Manual Testing
Follow the test steps in `SHA-273_TEST_PLAN.md` and execute manually, checking off each step.

### Automated Testing with Playwright

1. **Install Playwright:**
   ```bash
   npm install -D @playwright/test
   npx playwright install
   ```

2. **Configure Playwright:**
   Create `playwright.config.ts` in project root:
   ```typescript
   import { defineConfig } from '@playwright/test';
   
   export default defineConfig({
     testDir: './functional_test_scripts',
     use: {
       baseURL: 'http://localhost:3000',
     },
   });
   ```

3. **Run Tests:**
   ```bash
   npx playwright test
   ```

4. **View Results:**
   ```bash
   npx playwright show-report
   ```

## Prerequisites

Before running tests:

1. **Start Firebase Emulators:**
   ```bash
   npm run emulators:start
   ```

2. **Seed Test Data:**
   ```bash
   npm run seed:courses
   ```

3. **Start Development Server:**
   ```bash
   npm run dev
   ```

4. **Create Test User:**
   - Use Firebase Auth emulator UI or create via application

## Test Data Requirements

The seed script should create:
- 3 courses (Mathematics, English, French)
- Each course with at least 1 module
- Each module with:
  - At least 1 video lesson (with embedded questions and transcript)
  - At least 1 text lesson (with sections and visuals)

## Notes

- Tests are designed to be executed in order (some depend on previous test state)
- Some tests require waiting for auto-save intervals (30 seconds)
- Cross-browser testing recommended (Chrome, Firefox, Safari, Edge)
- Mobile testing should use real devices or responsive design mode

## Updating Tests

When updating tests:
1. Ensure test cases align with acceptance criteria in Linear
2. Update test IDs if new test cases are added
3. Document any changes in test plan
4. Update Playwright scripts if automation changes

## Reporting Issues

When defects are found:
1. Note the Test Case ID (e.g., TC-277-01)
2. Document steps to reproduce
3. Include screenshots/videos
4. Note browser/device information
5. Include console errors if any

