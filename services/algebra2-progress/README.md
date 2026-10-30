# Algebra 2 free preview

This service serves the existing `algebra-2/` application and its currently installed Lessons 89–96. Original lesson packages and manifests are unchanged. Their existing source-verification limitations remain in effect. The preview branch does not change the public Pages deployment on `main`.

Create one Render Web Service from branch `algebra2-preview`, using `services/algebra2-progress/render.yaml` as the Blueprint path. The plan is explicitly `free`. No database, disk, paid compute or background worker is requested. Automatic deployments are disabled so the idle test is not interrupted by a code update. Build: `node services/algebra2-progress/build-check.mjs`. Start: `node services/algebra2-progress/server.mjs`.

The connected preview runs at its own Render HTTPS origin, using a Secure, HttpOnly, host-only session cookie. Render supplies `RENDER_EXTERNAL_URL`; no guessed hostname is committed. The existing Pages app remains local-only until a separate integration is approved and validated.

## Required private configuration

Create an initialized, separate **private** progress repository, with default branch `main`. Register a GitHub App with Contents read/write and Metadata read only; disable unused webhooks and install it only on that private repository. The app needs no access to the public course repository. Keep its private key in Render's secret configuration.

Supply `GITHUB_DATA_REPOSITORY`, `GITHUB_APP_ID`, `GITHUB_APP_INSTALLATION_ID`, `GITHUB_APP_PRIVATE_KEY`, and `INSTRUCTOR_USERNAME` through Render. The Blueprint contains no real credentials. Do not put passphrases, private keys, live enrollment links, session cookies or student records in commits or chat.

For mobile initial setup, generate a cryptographically random 32-byte base64url capability privately. Configure only its SHA-256 digest as `INSTRUCTOR_SETUP_TOKEN_HASH` and a fixed absolute expiry as `INSTRUCTOR_SETUP_EXPIRES_AT` (24 hours for this preview). Leave `INSTRUCTOR_PASSWORD_HASH` unset. Give the owner the private HTTPS link `/instructor/setup#setup=<capability>` through the owner handoff. The responsive form checks the link, clears the fragment from browser history, and accepts a matching 15–256 character passphrase over HTTPS. Only its salted scrypt hash is committed to `progress/accounts.json` in the private repository. Setup cannot replace an existing instructor, and concurrent requests can create only one record. Login loads that durable record after restart even when the setup link has expired. The form uses no analytics, third-party assets or browser storage for credentials. Never put the capability in a query string, public file or screenshot.

The workstation-only alternative is to generate `INSTRUCTOR_PASSWORD_HASH` locally with `node services/algebra2-progress/password-hash.mjs`. A deployment configured with this fixed hash cannot use initial setup. Initial setup cannot reset an existing account. Owner-controlled recovery is described below.

Production startup refuses local-file storage and refuses a public progress repository or the course repository as storage. Only fixed account and student document paths are accessible through authenticated backend operations. Student requests cannot select a repository or arbitrary file.

## Persistence acceptance test

The following live checks remain required before reporting verified sleep/restart continuity:

1. Register a synthetic student and enroll through the private one-use link. Save submitted answers, drafts, notes and hints. Confirm **Saved to course account**.
2. Record the private GitHub progress file commit/blob hash, full progress revision and a canonical digest of the saved JSON. Record student and instructor category totals, weighted percentage and grade. Record `/api/health` instance ID.
3. Restart the Render service. Reopen the same authenticated browser and verify the recovered progress, sessions, revision, attempts, notes, hints and grades. The instance ID must change. The saved JSON and GitHub blob must remain identical unless deliberate new student work is saved.
4. Close preview tabs after all saves are confirmed. Stop health polling, monitoring and other inbound traffic. Leave the free service idle for more than 15 minutes. Confirm Render reports the service spun down before issuing a waking request.
5. Wake the service, allow about a minute for cold startup, and repeat the comparisons. A changed instance ID alone does not prove idle sleep; retain the Render sleep evidence as well.
6. Record exact timestamps, hashes and actual results separately from local simulations. Do not claim live continuity if any step is unavailable or fails.

Confirmed records, account metadata and hashed sessions live in private GitHub commits. Pending work is retained in browser storage and is explicitly labeled pending until the backend confirms a commit. Never rely on Render's temporary filesystem for durable records.

Free Render can sleep after 15 idle minutes and can restart at other times. This preview may be unavailable during cold startup or free-tier limits. Failed saves remain pending locally with a retry/backup option. Only confirmed remote saves are part of the remote persistence guarantee.

Practice exercises retain their original one-point raw credit but contribute ×0.25 during aggregation; Problem Set exercises contribute ×1. Chapter and course grades pool weighted points from completed lessons. In-progress lesson grades are provisional. The traditional plus/minus grade boundaries are assigned before display rounding.

References: [Render Free](https://render.com/docs/free), [Render Blueprints](https://render.com/docs/blueprint-spec), [GitHub App installation authentication](https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/authenticating-as-a-github-app-installation).

## Instructor recovery

The original passphrase cannot be recovered from its salted scrypt hash. Recovery is disabled by default. After verifying an owner request, generate a random 32-byte base64url capability privately. Configure its SHA-256 digest as INSTRUCTOR_RESET_TOKEN_HASH and a fixed one-hour absolute expiry as INSTRUCTOR_RESET_EXPIRES_AT in Render. Never commit the raw capability or send it to a different service. The private HTTPS link is /instructor/reset#reset=<capability>. No email delivery service is configured.

The owner enters, confirms, and submits the new phrase directly on the responsive page. Link status checks do not consume the grant. Successful submission atomically records the salted hash and consumed token digest in the private accounts document, and removes only instructor sessions. Student records, enrollment links, student sessions, and progress documents are preserved. Used grants cannot be replayed after restarts or subsequent resets. A normal instructor sign-in is required afterward. Remove the recovery variables after use; expiry also closes the recovery window. Never substitute initial setup, delete the account record, or overwrite private GitHub data to bypass recovery.
