# Validation Report — Algebra 2 Course Foundation v0.1

Validation date: 2026-10-05 CT

## Source basis

The foundation was built from the existing Lesson 89 v1.2 standalone app and its corrected Lesson 89 source package. The original standalone file is preserved unchanged under `archive/`.

## Static validation

- `node --check` passed for:
  - `src/engine.js`
  - `lessons/lesson-089.js`
  - `src/course.js`
- Lesson 89 registered successfully.
- Guided topics: 10.
- Exercises: 26.
- Question IDs: 26 unique.
- Every exercise references a valid section and guided topic.
- Every multiple-choice correct index is in range.
- A generated known-correct draft graded correct for all 26 exercises.

## Browser runtime validation

Chromium executed the exact standalone HTML content with no uncaught page errors in the tested flows.

### Dashboard and navigation

- Course dashboard rendered.
- Only Lesson 89 is marked prepared.
- Lesson 89 opens from the course dashboard.
- All lesson-stage workflow buttons are immediately enabled.
- Problem Set 89 can be opened without first completing guided topics or Practice 89.
- Returning to the course dashboard preserved lesson progress.

### Scoring policy

Explicit interaction checks passed:

1. **Multiple choice**
   - first submission incorrect;
   - second submission correct;
   - result: solved, **0 points**, shown as `CORRECT · PRACTICE ONLY`.

2. **Fill-in**
   - first submission incorrect;
   - second submission correct;
   - result: solved, **1 point**, shown as `CORRECT · CREDIT EARNED`.

3. **Fill-in after credit limit**
   - first and second submissions incorrect;
   - third submission correct;
   - result: solved, **0 points**, shown as `CORRECT · PRACTICE ONLY`.

### Progress accounting

After completing three Problem Set exercises in non-sequential scoring tests, the course dashboard reported Lesson 89 as:

`In progress · 3/26 exercises complete`

No navigation action itself consumed an attempt.

## Standalone Lesson 89 progress migration

### v1.2

A synthetic but schema-faithful v1.2 progress file was imported.

- Multiple-choice history: wrong first, correct second → retained as solved with 0 credit.
- Fill-in history: wrong first, correct second → retained as solved with 1 credit.
- Migration marker: `standalone-1.2.0`.

### v1.1

A v1.1 progress file with the same attempt histories was imported.

- Attempts were retained.
- Derived credit was recomputed under the shared course policy.
- Multiple choice wrong-first/correct-second remained 0 credit.
- Fill-in wrong-first/correct-second became 1 credit.
- Migration marker: `standalone-1.1.0`.

### v1.0

A v1.0 progress file containing an old-source Problem Set #11 attempt was imported.

- Unaffected Problem Set #1 attempt and workspace note were retained.
- Source-corrected #11, #12, and #16 were reopened under the corrected package.
- Migration marker: `standalone-1.0.0`.

## Course backup/restore

A course backup was captured after one answered exercise.

- A second temporary student profile was added.
- Restoring the earlier course backup returned the course to one profile.
- Lesson 89 progress returned as `In progress · 1/26 exercises complete`.
- No uncaught page errors occurred.

## Multiple profiles

- A second student profile could be created and selected.
- Each profile began with independent Lesson 89 state.

## Responsive checks

No horizontal document overflow was detected at:

- 320 px
- 390 px
- 768 px
- 1280 px

## Known validation limits

- The managed browser environment blocked direct `file://` navigation and localhost navigation.
- Therefore direct double-click local-file launching was not exercised end-to-end in the managed browser.
- The exact standalone HTML bytes were executed in Chromium by loading their content directly; JavaScript behavior and tested UI flows passed.
- The multi-file repository form received JavaScript syntax validation, but an actual GitHub Pages deployment was not performed.
- Physical iPhone/Safari behavior was not tested.
- Audio cue code executed without page errors in answer flows, but physical speaker loudness/timbre was not subjectively verified.

These limitations do not change the tested scoring, migration, navigation, and progress-state results, but they remain deployment/physical-device checks for later release qualification.
