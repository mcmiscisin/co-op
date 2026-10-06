# Progress Migration and Versioning

## Course progress format

Course backups use:

```json
{
  "format": "algebra2-course-progress",
  "version": "0.1.0",
  "activeProfileId": "...",
  "profiles": {
    "...": {
      "name": "Student",
      "lessons": {
        "lesson-089": { "...": "lesson state" }
      }
    }
  }
}
```

The course backup is the portable record for moving between devices or browsers.

## Lesson state

Each lesson state carries:

- stable lesson ID;
- content/source revision;
- scoring policy;
- reading checkpoints;
- current/last location;
- drafts and notes;
- full valid submission history;
- hints;
- solution-review state;
- derived solved/credit state;
- completion timestamps.

Derived score fields are re-computed from the attempt history when a progress file is normalized.

## Standalone Lesson 89 migration

The Lesson 89 package includes an adapter for standalone progress versions 1.0, 1.1, and 1.2.

### Version 1.2

Attempts and notes are retained and re-evaluated under the same one-choice/two-fill course scoring policy.

### Version 1.1

Attempts and notes are retained. Because 1.1 used the earlier first-attempt-only scoring method, the course re-evaluates the complete retained attempt history under the current policy rather than copying a derived score.

### Version 1.0

The earlier source edition had exercises later corrected from clearer source photographs. The adapter reopens affected source-corrected exercises rather than treating old selections as answers to changed questions. Unaffected attempts and notes are retained.

## No silent automatic browser migration

The standalone and course apps intentionally use different storage namespaces. A renamed/moved local HTML file can also have a different browser-storage context.

Therefore migration is explicit:

**standalone app → Save progress file → course app → Restore / import**

This avoids silently merging the wrong student or version.

## Future content correction rule

When a lesson question changes because its source transcription or answer key changed:

1. identify the exact stable question IDs affected;
2. preserve unrelated lesson progress;
3. reopen or explicitly re-grade only when the old response still has the same semantic meaning;
4. write a migration note visible to the student/teacher;
5. do not grant additional attempts accidentally.

## Course-engine upgrades

An engine upgrade should preserve lesson package IDs and question IDs. The engine may recompute derived status from immutable attempt records, but must not alter the recorded attempt sequence.
