# Code Mentor

Code Mentor is a debugging practice workspace. The first vertical slice teaches a JavaScript loop boundary bug with progressive deterministic hints. The backend never executes submitted code, and the browser keeps the same static feedback available if the API is offline.

## Run locally

1. Install client dependencies with `npm install` in this directory.
2. Keep the local `.env` file and add Firebase web settings there when authentication is configured. `.env.example` shows the variable names.
3. In `../code_mentor_server`, install dependencies and configure its local `.env` from `.env.example`. MongoDB is optional for the current demo.
4. Start the API with `npm run dev` in the server directory.
5. Start the client with `npm run dev` here and open the Vite URL.

The client uses `VITE_API_URL` for the API address. Firebase values can remain empty while trying the sample challenge.

## Sign up and sign in

The client supports email/password and Google authentication on both the sign-up and login pages. In Firebase Console, enable **Email/Password** and **Google** under Authentication → Sign-in method, then add `localhost` under Authentication → Settings → Authorized domains if it is not already listed. Configure the Firebase web app values in the client `.env` and restart Vite after changing them. Google sign-in uses Firebase's popup flow; users with an existing account under another provider should sign in with that method first.

## AI integration

AI is not required for the current demo. Later, a server-side OpenAI API key can add natural-language coaching; deterministic challenge checks and hints remain the fallback. Add the key only to `code_mentor_server/.env` as `OPENAI_API_KEY`. Never use a `VITE_` prefix for private keys. See [roadmap.md](./roadmap.md) for priorities, stakeholder workflows, and the API key setup outline.

## Security notes

Commit `.env.example`, not `.env`. A private repository is not secret storage. If any real value from the server `.env` has already been pushed, rotate it in its provider and remove it from repository history before sharing access. Firebase web configuration is visible in the browser and relies on domain restrictions and Firebase rules for protection.
