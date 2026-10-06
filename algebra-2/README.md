# Algebra 2 Studio — Course Foundation v0.1

This package establishes the shared Algebra 2 course architecture using Lesson 89 as the first validated lesson package.

## What is included

- `index.html` — GitHub/local multi-file entry point.
- `src/engine.js` — shared course and lesson engine: profiles, navigation, progress, scoring, feedback, sound, backup/restore, reports.
- `src/styles.css` — shared responsive styling.
- `src/course.js` — course bootstrap.
- `lessons/lesson-089.js` — Lesson 89 content package: guided topics, Practice 89, Problem Set 89, answer keys, worked solutions, reference content, graph, and the Lesson 89 pattern lab.
- `archive/lesson_89_standard_forms_v1_2.html` — preserved prior standalone Lesson 89 app, unchanged.
- `docs/` — content schema, lesson-production workflow, migration/versioning rules, and representative-lesson selection guidance.

A separately generated `algebra2_course_foundation_v0_1.html` is the single-file standalone build. It contains the same engine and Lesson 89 package inline.

## Current scope

The course catalog reserves Lesson 1 through Lesson 137. Only Lesson 89 is marked available because it is the only lesson currently supplied and validated for this course foundation. The other lesson slots say that source material has not yet been supplied; the app does not invent lesson titles, chapter assignments, exercises, or answer keys.

## Student behavior carried forward from Lesson 89 v1.2

- Students may jump freely among guided topics, Practice problems, Problem Set problems, and the progress report.
- Navigation does not submit an answer, consume an attempt, or reset attempts.
- Multiple choice: one valid credit-bearing try.
- Fill-in: two valid credit-bearing tries.
- Later correct answers remain recorded as solved without credit.
- Mixed questions can use separate credit limits by answer group while still awarding at most one point for the exercise.
- Prominent correct/incorrect/credit banners.
- Quiet synthesized correct/incorrect audio cues, with sound and motion controls.
- Draft answers, workspace notes, hints, attempts, and results persist per question.
- Course progress and lesson progress are separate from content-preparation status.

## Progress model

Course backups contain one or more student profiles. Each profile owns its own lesson states. A lesson state records stable lesson/question IDs, content/source version, attempts, drafts, notes, hints, reading checkpoints, completion, and score.

Unstarted or unavailable lessons are never counted as zeros. The course score is computed only from points in completed prepared lessons.

## Importing existing Lesson 89 progress

1. In the prior standalone Lesson 89 app, use **Save progress file**.
2. Open the course app.
3. Choose the student profile that should receive the progress.
4. Select **Restore / import** and choose the standalone progress JSON.
5. Confirm **Import Lesson 89**.

The migration adapter accepts standalone Lesson 89 versions 1.0, 1.1, and 1.2. Version 1.0 source-corrected exercises are reopened rather than silently graded against changed source content. Versions 1.1 and 1.2 retain the corrected source edition. All imported attempts are re-evaluated under the shared course scoring policy, so importing does not grant fresh credit-bearing tries.

The course app uses a different browser-storage key from the standalone app; automatic browser storage is not silently copied. Use a progress file for an explicit, auditable migration.

## Running locally

### Single-file release

Open `algebra2_course_foundation_v0_1.html` in a full browser with JavaScript enabled. It does not require external libraries or network access.

### Repository form

The repository form uses ordinary CSS and classic JavaScript files rather than JavaScript modules or runtime `fetch()`. It can be hosted on any static web server. For GitHub Pages, place the package contents at the selected Pages publishing root so `index.html` is the entry page.

## Adding lessons

Do not copy the entire application for each lesson. Create a lesson package that registers with the shared engine. Follow:

- `docs/LESSON_PACKAGE_SCHEMA.md`
- `docs/LESSON_PRODUCTION_WORKFLOW.md`

The engine is intentionally not allowed to infer missing lesson content. New package fields should be added only when actual lesson source material demonstrates that a new instructional or response format is required.

## Foundation status

This is a foundation release, not a claim that the 137-lesson curriculum has been transcribed. Lesson 89 is the reference package; representative additional lessons are the next validation step.
