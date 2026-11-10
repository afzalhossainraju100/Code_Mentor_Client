# Code Mentor (client)

Code Mentor teaches new coders to program by **fixing real bugs**. Learners get small JavaScript functions that contain one kind of bug, investigate with a step-by-step visualizer and progressive hints, and prove their fix against hidden tests. Every attempt feeds a personal skill profile that decides what to practise next.

This repository is the React client. The API lives in [Code_Mentor_Server](https://github.com/shahi1437/Code_Mentor_Server).

## Features and where they live

| # | Feature | What it does | Main code |
|---|---------|--------------|-----------|
| 1 | Personalized Bug Challenge Engine | Picks easy/medium/hard from past performance; repeated mistakes in a topic bring a new kind of bug in that topic | server `src/engine/recommender.js`, `components/RecommendationCard.tsx` |
| 2 | Intelligent Code Verification | Runs the fix against visible + hidden tests; checks syntax, runtime safety, logic, boundaries and output format | `lib/runner/*`, server `src/engine/grader.js`, `components/VerificationReport.tsx` |
| 3 | Visual Bug Execution Analyzer | Replays one call line by line with variable values, changed values and per-line run counts | `lib/runner/instrument.ts`, `components/ExecutionVisualizer.tsx` |
| 4 | Weakness Fingerprint | Turns failed attempts, repeated mistakes, time and hints into named weaknesses with code evidence | server `src/engine/learnerState.js`, `components/WeaknessCard.tsx` |
| 5 | Progressive Hint Mentor | Clue → concept → direction, never the full answer; hint use lowers mastery credit | server `src/engine/hints.js`, `components/HintPanel.tsx` |
| 6 | Real Understanding Verification | A concept is "verified" only after fixing two different bugs about it (twin challenge) | server `routes/challengeRoutes.js`, `components/SuccessPanel.tsx`, `components/ConceptMap.tsx` |
| 7 | Learning DNA & Progress Analytics | Activity heatmap, skill heatmap, success rate, speed, hint dependency, topic trends, six learning traits | server `src/engine/analytics.js`, `pages/AnalyticsPage.tsx` |
| 8 | Adaptive Recovery Plan | Daily 10–15 minute plan: weakness focus, spaced reviews (1/3/7/14 days), twin verification, new ground | server `src/engine/recoveryPlan.js`, `pages/RecoveryPlanPage.tsx` |

All features work **without any AI API**. They run on a transparent rule-based engine. An AI provider can later rephrase hints, but it is never required (see [AI mentor](#ai-mentor-optional)).

## Tech stack

React 19 · TypeScript · Vite 8 · Tailwind CSS 4 · React Router 7 · Firebase Authentication (email/password + Google) · acorn (JavaScript parser for the visualizer) · motion (animations) · react-icons

## Project structure

```
src/
  auth/        Firebase setup, user context, sign-in helpers, friendly error messages
  components/  Every reusable UI component (editor, visualizer, cards, charts, forms…)
  hooks/       useApi: load data from the API
  layout/      PublicLayout (landing), AuthLayout (login/sign-up), DashboardLayout (signed-in app)
  lib/         API client, formatting, syntax highlighter
    runner/    Safe code runner: parses, instruments and executes learner code in a Web Worker
  pages/       One file per route: Home, Login, Signup, ForgotPassword, Dashboard,
               Challenges, Practice, RecoveryPlan, Analytics, NotFound
  routes/      AppRoutes: which URL shows which page (signed-in pages are lazy-loaded)
  types/       Shapes of the API responses
```

## Getting started

Requirements: Node.js 20.19+ (22 recommended).

```bash
# 1. API (in ../code_mentor_server)
npm install
copy .env.example .env      # then fill in MongoDB + Firebase Admin values
npm run dev                 # http://localhost:5000

# 2. Client (this folder)
npm install
copy .env.example .env      # then fill in the Firebase web config
npm run dev                 # http://localhost:5173
```

### Environment variables (`.env`)

| Variable | Purpose |
|----------|---------|
| `VITE_FIREBASE_*` | Firebase web app config (Project settings → Your apps). Public by design. |
| `VITE_API_URL` | Code Mentor API address, default `http://localhost:5000` |

Restart `npm run dev` after changing `.env`.

### Firebase setup

1. Firebase Console → Authentication → Sign-in method: enable **Email/Password** and **Google**.
2. Authentication → Settings → Authorized domains: make sure `localhost` (and your deployed domain) is listed.
3. The server needs a Firebase **Admin** service account to verify sign-ins (see the server README).

## Scripts

| Command | What it does |
|---------|--------------|
| `npm run dev` | Start the development server |
| `npm run build` | Type-check and build for production into `dist/` |
| `npm run lint` | Lint with oxlint |
| `npm run preview` | Serve the production build locally |

## How learner code runs safely

Learner code never runs on the server. In the browser it is:

1. **Parsed** with acorn. Syntax errors are reported with a line number.
2. **Instrumented**: a counter is added to every loop, so an infinite loop stops with a clear message instead of freezing the tab. For the visualizer, a snapshot of the variables is recorded before each statement.
3. **Executed in a disposable Web Worker** with a 5-second timeout, so the page stays responsive.

The browser sends only the outputs to the server. The server owns the expected values of the hidden tests and grades the submission.

## AI mentor (optional)

The server has a single adapter file (`code_mentor_server/src/services/aiMentor.js`) where an AI provider can be plugged in to personalise hints. The key must live **only** in the server `.env` (`AI_PROVIDER`, `AI_API_KEY`, `AI_MODEL`), never in a `VITE_` variable. If the AI is missing, slow or returns something invalid, the static hint ladder is used automatically.

## Security notes

- Commit `.env.example`, never `.env`.
- Firebase web config is visible in the browser; protect the project with authorized domains and API key restrictions.
- `node_modules/` and `dist/` are not committed: run `npm install` after cloning.
