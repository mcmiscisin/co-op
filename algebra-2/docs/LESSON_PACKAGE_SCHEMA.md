# Lesson Package Schema

The course uses a shared engine plus lesson packages. A lesson package supplies content; the engine supplies navigation, state management, grading workflow, feedback, persistence, profiles, and reporting.

## Required package identity

```js
{
  id: "lesson-089",              // stable, never reused for another lesson
  number: 89,
  chapter: "Chapter 12",         // only when confirmed by source
  title: "Standard Forms",
  contentVersion: "course-package-1.0",
  sourceRevision: "lesson89-2026-10-02-closeups"
}
```

IDs are persistence keys. Changing visible wording must not change an existing stable ID unless the underlying task has materially changed and a migration is provided.

## Guided topics

```js
topics: [{
  id: "pattern",
  title: "A square is a product",
  short: "The plus pattern",
  intro: "...",
  body: "...",
  steps: [
    ["Step title", "Step explanation"],
    ["Step title", "Step explanation"]
  ],
  after: "...",
  mini: {
    prompt: "...",
    options: ["...", "...", "..."],
    correct: 1,
    explain: "..."
  }
}]
```

`mini` checks are instructional and unscored. A lesson may omit them.

## Exercise sections

```js
sections: [
  { id: "practice", label: "Practice 89", intro: "..." },
  { id: "problem",  label: "Problem Set 89", intro: "..." }
]
```

The engine does not require these exact names. A future lesson can define other sections when supported by source material.

## Question base fields

```js
{
  id: "s-3",                 // stable within the lesson
  section: "problem",
  label: "3",                // displayed textbook number/letter
  skill: "Scientific notation",
  type: "scientific",
  prompt: "...",
  page: 435,                 // source metadata, when known
  lesson: "science",         // guided-topic ID for concept review
  guide: ["...", "..."],
  hints: ["...", "..."],
  solution: ["...", "..."],
  answerHTML: "...",
  answerText: "..."
}
```

## Multiple-choice group

```js
choices: [
  { label: "A", html: "..." },
  { label: "B", html: "..." }
],
correct: 1
```

Default credit limit: **1 valid submission**.

## Fill-in group

```js
fields: [{
  key: "x",
  label: "x =",
  placeholder: "fraction or decimal",
  value: -1.6,
  tolerance: 1e-9
}]
```

Default credit limit: **2 valid submissions**.

Several fields can form one fill-in group. Every required field must be correct together for that group to be solved on a submission.

## Mixed question

A question can contain both `choices` and `fields`. Each group keeps its own credit limit. The exercise earns its single point only if every required group is solved within its own limit.

A correct group is retained while the student continues working on another group.

## Per-question credit override

Only add a different limit when the actual course design requires it:

```js
creditLimits: {
  choice: 1,
  fields: 2
}
```

Do not silently change global scoring policy merely to accommodate one unusual exercise.

## Numeric input

The engine accepts controlled numeric arithmetic, fractions, mixed numbers, square roots, exponentiation, and scientific `e` notation. It does not execute arbitrary JavaScript or algebraic variable expressions.

For response types not safely represented by the current parser, add a new explicit response/validator type rather than broadening the parser casually.

## Visual or interactive material

A package may provide:

- `renderQuestionAsset(question)` for a verified graph/diagram.
- `mountTopicExtras(...)` for a lesson-specific interactive teaching aid.
- `handleAction(...)` / `handleInput(...)` for that aid.

Visuals should be reconstructed from confirmed source values when possible. If a source image is itself required for the task, preserve its provenance and licensing constraints separately.

## Source-status metadata

Each package should record:

```js
sourceStatus: {
  pages: "433–436",
  verified: "2026-10-02 close-ups",
  uncertainItems: []
}
```

An unresolved expression or answer choice belongs in `uncertainItems` and must not be silently converted into a scored question.

## Versioning rule

Increment `contentVersion` when lesson content, answer keys, source transcription, or question structure changes materially. The course engine version is separate; engine changes should not force lesson content IDs to change.
