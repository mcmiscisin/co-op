# Repeatable Lesson-Production Workflow

This workflow is the gate for adding any of the remaining Algebra 2 lessons.

## 1. Source intake

Collect the lesson pages/screenshots that define:

- lesson title and chapter context;
- instructional concepts and examples;
- Practice exercises;
- Problem Set/review exercises;
- graphs, diagrams, tables, or special notation;
- explicit rounding, domain, or answer-format instructions.

Record the page numbers or other source identifiers.

**Rule:** screenshots are information sources for building the app. They are not the default user interface.

## 2. Source-legibility review

Before authoring the lesson package, classify every source item:

- **CONFIRMED** — symbols, exponents, signs, answer choices, and instructions are legible.
- **NEEDS_CLOSEUP** — one or more details cannot be read reliably.
- **NOT_SUPPLIED** — expected material is missing.

Do not guess. `NEEDS_CLOSEUP` items remain outside scored content until resolved.

## 3. Transcription ledger

Create a compact ledger containing:

- original question number/letter;
- page/source reference;
- exact mathematical expression or prompt;
- all printed answer choices where applicable;
- response type;
- any special instruction such as rounding;
- verification status.

This ledger is the review surface before coding.

## 4. Concept map

Identify the mathematical concepts actually needed for the supplied exercises.

For each concept, decide whether the lesson needs:

- explanation;
- worked example;
- quick unscored check;
- reference-sheet entry;
- interactive visualization.

Additional teaching support can be app-authored, but it must be clearly distinguished from original exercise content.

## 5. Exercise inventory and answer verification

For every exercise:

1. solve it independently;
2. verify the answer against the supplied choices or task wording;
3. write the worked solution;
4. define acceptable input forms/tolerance;
5. verify the assigned response type and credit limit;
6. confirm that any diagram values match the source.

A scored answer key is not accepted merely because it appears plausible.

## 6. Package construction

Create a new stable package ID, for example:

`lesson-090`

Add:

- identity and source revision;
- topics;
- exercise sections;
- questions;
- answers and solutions;
- any verified visual renderer;
- source-status metadata.

Do not modify the shared engine for content differences that belong in the package.

## 7. Package validation

Minimum automated checks:

- JavaScript syntax;
- package registers exactly once;
- stable IDs are unique;
- every question refers to a valid section and concept topic;
- every multiple-choice `correct` index exists;
- every field has a validator target;
- grading of the known correct answer passes;
- known incorrect answers fail;
- first/second/later-try credit behavior is correct;
- free navigation does not mutate attempts;
- reveal-solution behavior produces zero credit;
- progress save/restore round-trips;
- prior lessons retain the same scores after adding the new package;
- responsive layout is exercised at phone and desktop widths.

## 8. Human visual/source review

Before calling the lesson validated:

- compare the rendered problem text to the source;
- inspect superscripts, radicals, fractions, and signs;
- check graph labels and coordinates;
- inspect mobile layout;
- verify feedback messages and sound/mute behavior;
- spot-check worked solutions.

## 9. Release without disturbing prior student records

Adding a new lesson must not rewrite prior lesson states.

If an existing lesson package changes materially:

- increment its content version;
- identify affected question IDs;
- provide an explicit migration policy;
- preserve unaffected attempts and notes;
- never silently re-grade a changed question against a different source expression.

## 10. Evidence retained per lesson

Keep:

- source-status summary;
- question inventory;
- validation report;
- package version;
- known limitations;
- migration notes, if any.

This is intentionally stricter than simply generating an HTML page because the course will eventually contain 137 persistent, scored lessons.
