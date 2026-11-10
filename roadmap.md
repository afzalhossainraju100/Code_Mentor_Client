# Code Mentor delivery roadmap

## Product goal

Help beginner programmers learn to debug by working through buggy code, receiving progressively clearer clues, and demonstrating that they understood the underlying concept. The platform should preserve learner agency: it should not silently replace a learner's work with a complete answer.

## Delivery order

### 0. Safe project foundation — current

- Separate client and server configuration with `.env.example` templates.
- Keep real credentials local; publish templates, never live secret values.
- Basic server limits, explicit CORS origins, safe error responses, and API input validation.
- Ship a simple challenge with deterministic checks and an offline fallback.

### 1. Core learner journey

- Learner profile and onboarding: experience, preferred language, daily goal, and accessibility needs.
- Challenge catalog with topic, language, difficulty, and estimated time filters.
- Code editor with save/reset, clear prompt, sample input/output, and submit controls.
- Submission history and transparent pass/fail feedback.
- First fully supported language and small reviewed exercise set.

### 2. Reliable code verification

- Run code only in an isolated execution service with CPU, memory, time, and network limits.
- Evaluate visible and hidden test cases, boundary values, output format, and runtime errors.
- Normalize compiler output to safe diagnostics; never return infrastructure details.
- Add submission quotas, abuse protection, and audit logs before public launch.

### 3. Guided debugging loop

- Progressive hints: identify the area, ask a diagnostic question, explain the concept, then offer a next step.
- Record hint usage, attempts, time to solve, and corrected misconception.
- Give a short explanation after success and ask the learner to describe the fix.
- Revisit the same concept using a different exercise to check transfer.

### 4. Weakness profile and progress analytics

- Derive topic strengths from test outcomes, repeated error types, hint dependence, and retry patterns.
- Show evidence and confidence with each skill estimate; avoid presenting estimates as facts.
- Add daily activity, attempts, success rate, solving time, and topic improvement views.
- Let learners review, export, or delete their learning history.

### 5. Personalized bug challenges and recovery plans

- Select a buggy snippet by current skill, topic weakness, and recent performance.
- Adjust difficulty gradually and explain why a challenge was selected.
- Build a short daily recovery plan from weak concepts, then update it from new evidence.
- Keep deterministic selection rules as the fallback if AI is unavailable.

### 6. AI mentor integration

- Add a server-side AI adapter only after the deterministic experience is useful.
- Validate structured model output and reject full-solution responses by default.
- Send only the exercise, learner code, test results, and minimum necessary history.
- Add timeouts, retries, cost limits, privacy controls, monitoring, and deterministic fallback.
- Measure whether AI hints improve independent transfer, not just completion.

### 7. Visual execution analyzer

- Start with an AST-based trace for a deliberately limited language subset.
- Show line-by-line state changes, variable values, and loop iterations.
- Use safe instrumentation or a sandbox; never execute learner code in the web server process.
- Add AI-generated explanations only as an optional layer over verified execution traces.

### 8. Admin and launch readiness

- Admin exercise authoring, review, versioning, and retirement workflow.
- Role-based access, Firebase rules, retention controls, backups, and account deletion.
- Accessibility review, privacy review, monitoring, incident response, and deployment checklist.
- Expand languages only after the current language's runner and exercise content are reliable.

## User and stakeholder workflows

### Learner

1. Visits the workspace and tries the sample challenge; sign-in is optional for the local demo.
2. Chooses a challenge by topic and difficulty.
3. Reads the expected behavior and edits the code.
4. Submits; the verification service runs checks and returns normalized results.
5. If stuck, requests the next hint. Each hint is more specific and the usage is recorded.
6. Fixes the code, reviews why it worked, then completes a different challenge on the same concept.
7. Reviews skill progress and the evidence behind each weak-topic recommendation.

### Mentor or instructor

1. Selects a cohort or learner whose progress they are allowed to view.
2. Reviews topic-level trends, repeated misconceptions, and hint dependence rather than raw private code by default.
3. Assigns reviewed challenges or a recovery plan.
4. Uses learner-visible evidence to coach; does not treat automated skill estimates as a grade.

### Content author / administrator

1. Drafts an exercise with concept, difficulty, starter code, expected behavior, tests, and hint ladder.
2. Runs validation and reviews the solution and edge cases.
3. Publishes a version; retires or replaces it without corrupting old submission history.
4. Reviews anonymous quality signals and AI feedback failures, with access logged.

### System / AI service

1. Authenticates the learner and checks request size, rate, and access.
2. Runs code in the isolated runner and produces structured diagnostics.
3. Tries the configured AI provider for a bounded, schema-validated hint when enabled.
4. Uses deterministic hint logic on missing key, timeout, provider error, invalid output, or quota exhaustion.
5. Stores only necessary progress and operational metadata under retention rules.

## AI key needed later

For natural-language debugging hints, the recommended first integration is an OpenAI API key used by the server only. It is different from ChatGPT Plus and API usage is billed separately. Follow these steps when you are ready:

1. Sign in at [OpenAI API Platform](https://platform.openai.com/).
2. Open Billing and add a payment method or API credits if the account requires it. ChatGPT Plus does not pay for API calls.
3. Create or select a project for Code Mentor, then open that project's API Keys page.
4. Choose **Create new secret key**, copy it once, and store it safely. OpenAI does not show the full key again; create a replacement if it is lost. See the [official API key instructions](https://help.openai.com/en/articles/4936850-where-do-i-find-my-openai-api-key) and [project guide](https://help.openai.com/en/articles/9186755-managing-projects-in-the-api-platform).
5. Put it only in `code_mentor_server/.env` as `OPENAI_API_KEY=...`. Do not paste it into chat, commit it, or use a `VITE_` variable.
6. Share only that the key is ready. We can wire the provider and select the model then; no key is needed for the deterministic MVP.

## Configuration and repository safety

- `.env.example` is the shareable template. `.env` contains local values and must stay out of commits.
- Firebase browser config is public configuration and must be protected with Firebase domain restrictions and security rules.
- Firebase Admin credentials, database URI, and AI API keys are private server secrets.
- Making a GitHub repository private does not remove credentials from its history or prevent collaborators from copying them. If a real secret was pushed, revoke and rotate it.
- Keep the client and server deploy origins separate and configure production values outside source control.
