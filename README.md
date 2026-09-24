# Jev vs. Jev

> Describe a task. Jev decides whether Jev should handle it.

A small, playful experiment built with Next.js, TypeScript, and Jev. The page sends your task to Jev once and displays its YES/NO answer. It does not use a generative model to write an explanation or a local heuristic to invent a verdict.

**Live app:** [jev-vs-jev.vercel.app](https://jev-vs-jev.vercel.app/) · [Go straight to the checker](https://jev-vs-jev.vercel.app/try)

## Run locally

Requires Node.js 18+ and an Experiential Labs, OpenRouter, or TypeSafe API key.

```bash
npm install
cp .env.example .env.local
```

Create an [OpenRouter key](https://openrouter.ai/keys) and set it in `.env.local`:

```text
OPENROUTER_API_KEY=your_key_here
```

Keep the key private. OpenRouter bills Jev usage to your account, so check its balance and key limits before sharing the app. Existing Experiential Labs and direct TypeSafe keys remain optional. When multiple keys are set, the app chooses OpenRouter, then Experiential Labs, then TypeSafe. Then run:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the meme-led introduction, then select **Launch Jev**. The checker is at [http://localhost:3000/try](http://localhost:3000/try).

Without an API key, the app displays a configuration error. It never switches to a simulated answer.

## Project layout

Application code lives in `src/`: `app/` holds pages and the API route, `components/` holds UI pieces, `lib/` holds the Jev integration and shared helpers, and `middleware.ts` handles old share links. The landing image stays in `public/`, tests stay in `tests/`, and tool configuration stays at the project root.

## Deploy your own

Deploy this Next.js repo on Vercel and add `OPENROUTER_API_KEY` as a server-side environment variable in the Vercel project settings. Set a spending limit on the key before sharing your deployment. Keep the key out of the repository and browser; `.env.example` lists the supported alternatives for local use.

## How the judgment works

`POST /api/evaluate` validates a 1–2,000 character task and sends one request to Jev. Experiential Labs uses `https://api.experientiallabs.ai/v1/systemone` with `model: "jev-latest"`. Direct TypeSafe access uses its `/v1/systemone` endpoint with the same model; OpenRouter uses `/api/alpha/decisions` and `model: "typesafe/jev-1.13"`. The named `fit` question is a `noul` yes/no question:

> Is this task suitable for Jev to perform?

The question describes bounded decisions such as classification, routing, ranking, scoring, and verification as a fit. It describes substantial open-ended text, code, image, or other content generation as outside that fit.

The API returns `answers.fit.noul`, a number from 0 to 1 representing the probability of yes. The app shows YES at 0.5 or above, otherwise NO. The displayed percentage is the probability toward the selected answer. A `noul` answer has no separate confidence field. The server validates the response; invalid or failed responses display an error. The observed time includes the HTTP request and is not a model benchmark.

The API key stays on the server. A basic in-memory request limit is included; use a hosted rate limit if public traffic grows.

## Sharing

`Copy Result` copies the current Jev answer as text. `Share Task` copies a `/try?task=...` URL containing only the task; opening it asks Jev again, so the answer may differ from the original run. Old `/?task=...` links redirect to the checker. The task appears in the URL, so avoid using Share Task for sensitive text.

## Verify

```bash
npm test
npm run build
```

The tests cover the Jev request and response contract, probability mapping, invalid responses, upstream failures, input validation, and share text.

## About the experiment

This is Jev's opinion about its own suitability. It is not a capability guarantee, a scientific benchmark, or a recommendation to deploy Jev for a particular task. Laya comparison is deferred from this first version.

The landing page uses a user-supplied meme. If you fork the project, check the image's reuse terms for your own deployment.
