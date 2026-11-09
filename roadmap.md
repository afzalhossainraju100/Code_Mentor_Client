# Coding Pro Roadmap

Coding Pro is a Socratic coding-learning platform. Its core promise is to help a learner understand *why* code fails instead of silently rewriting it for them.

## Product principles

1. **Guide, do not solve:** AI asks targeted questions and gives hints in increasing levels of specificity.
2. **Preserve learner agency:** The learner edits and resubmits their own code.
3. **Explain the reasoning:** Every diagnostic connects the error to a concept and a reproducible debugging step.
4. **Measure learning:** Progress tracks concepts mastered and debugging attempts, not only completed exercises.
5. **Protect secrets:** Firebase browser configuration is loaded from environment variables; MongoDB credentials and AI provider keys remain on a server.

## Ordered delivery plan

### Phase 1 — Foundation (current)

- React + TypeScript + Vite application.
- Tailwind CSS for responsive styling.
- React Router for page navigation.
- React Icons and Motion for interface polish and feedback animations.
- Firebase client module ready for Auth, Firestore, and Storage once project values are supplied.
- Environment template separating public Firebase values from server-only MongoDB credentials.
- Initial landing page, workspace route, and roadmap route.

### Phase 2 — Authentication and learner profile

- Connect Firebase project configuration.
- Add email/password and Google sign-in.
- Add protected routes and session persistence.
- Create learner profile and onboarding goals in Firestore.
- Add Firestore security rules and emulator-based tests.

### Phase 3 — Learning content

- Define exercise, language, difficulty, concept, test-case, and hint schemas.
- Build exercise catalog with search and filtering.
- Add exercise detail page with expected behavior, constraints, and examples.
- Add progress, streak, and concept mastery views.

### Phase 4 — Code workspace

- Add a syntax-highlighted editor (Monaco or CodeMirror) with starter code and reset.
- Add language-aware execution through a sandboxed backend service.
- Normalize compiler/runtime output into safe, structured diagnostics.
- Show stdout, stderr, test failures, and execution limits without exposing server internals.
- Save drafts and submissions with debounced persistence.

### Phase 5 — Socratic AI (load-bearing capability)

- Create a backend AI orchestration service; never call the AI provider directly from the browser.
- Send only the exercise context, learner code, diagnostics, previous attempts, and conversation state.
- Define a response schema: observation, question, hint level, next action, and concept reference.
- Add a policy prompt that forbids returning a complete corrected solution by default.
- Implement progressive hints: clarify the goal, point to a relevant region, ask for a hypothesis, then explain the concept after learner effort.
- Detect repeated failed attempts and offer a small, explicit next step instead of dumping an answer.
- Log model latency, token usage, feedback quality, and learner outcomes without storing unnecessary personal data.

### Phase 6 — Persistence and analytics

- Use Firestore for identity, exercises, progress, and lightweight conversation metadata.
- Use MongoDB from the backend for detailed submissions, diagnostic traces, and analytics where flexible documents are useful.
- Add retention rules, indexes, pagination, and export/delete account flows.
- Add an admin view for exercise authoring and reviewing AI feedback quality.

### Phase 7 — Quality and launch

- Unit test diagnostics, hint policy, progress calculations, and access rules.
- Add integration tests for sign-in, submission, AI response validation, and persistence.
- Add rate limits, abuse protection, content safety, and cost controls.
- Add error monitoring, structured logs, performance budgets, and accessibility checks.
- Deploy the frontend and backend separately with environment-specific configuration.

## Immediate next steps

1. Supply Firebase web configuration and create `.env.local` from `.env.example`.
2. Decide the first supported language (JavaScript is the fastest MVP path).
3. Choose the code execution sandbox and AI provider.
4. Create the backend service before connecting MongoDB credentials or AI keys.
5. Implement one complete vertical slice: one exercise, one submission, one diagnostic, and one Socratic hint.
