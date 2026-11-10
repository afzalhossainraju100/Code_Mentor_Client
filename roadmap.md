# Code Mentor roadmap

## Product goal

Help beginner programmers learn to code and debug by working through buggy code, receiving progressively clearer clues, and proving they understood the underlying concept. The platform preserves learner agency: it never silently replaces the learner's work with a complete answer.

## Done

- **Foundation:** separate client/server, `.env.example` templates, Firebase sign-in (email/password + Google, password reset), MongoDB profiles and attempts, CORS, input validation, rate limits, safe errors, CI for both repositories.
- **Challenge bank:** 30 JavaScript bug challenges across 5 topics and 15 concepts, each with visible + hidden tests, a 3-step hint ladder and an explanation; automatic content validation.
- **Safe runner:** learner code is parsed, loop-guarded and executed in a disposable Web Worker; never on the server.
- **All 8 features** with a rule-based engine: personalized challenge selection, verification checks, visual execution analyzer, weakness fingerprint with code evidence, progressive hints, twin-challenge understanding verification, Learning DNA analytics, and the adaptive daily recovery plan.

## Next

1. **AI mentor (optional layer):** connect a provider in `code_mentor_server/src/services/aiMentor.js` to personalise hints for the learner's current code. Validate the output, never return full solutions, keep the static hints as fallback, and measure whether AI hints improve independent solving.
2. **Deployment:** host the client (e.g. Vercel/Netlify) and API (e.g. Render/Railway); set `NODE_ENV=production`, production `CLIENT_ORIGIN`, and add the deployed domain to Firebase authorized domains.
3. **Learner controls:** onboarding (experience, daily goal), export and delete learning history.
4. **More content:** strings and objects topics, more variations per concept, then a second language once the runner supports it.
5. **Mentor/instructor view:** cohort-level trends and assigned plans, without exposing private code by default.
6. **Admin authoring:** create, review, version and retire challenges from a UI instead of code.

## Principles

- Hints point to the idea, never to the answer.
- Every skill estimate shows the evidence behind it and is never treated as a grade.
- AI is an optional layer on top of verified, deterministic results, never the source of truth.
- Secrets stay on the server; `.env` files and service-account keys are never committed.
