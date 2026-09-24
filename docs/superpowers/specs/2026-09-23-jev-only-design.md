# Jev judges Jev — design

## Purpose

A playful, one-screen experiment: a visitor describes a task and Jev decides whether Jev is a suitable model for it. The result is Jev's opinion, not a capability guarantee or benchmark. The first release uses only Jev.

## User experience

The page has one task box, a few clickable examples, and one “Ask Jev” button. After submission it shows **YES** or **NO**, the model's probability toward that answer, and observed request time. A brief note explains the experiment. Copy Result produces a short text summary; a task link may preload and re-evaluate the task, but must not imply it preserves the original result.

While a request runs, the button shows a loading state. Invalid input is rejected before sending. Missing credentials, timeout, a non-success HTTP response, or malformed model output show a clear unavailable/error state with retry. No fabricated verdict or silent simulation is presented.

## Data flow

`POST /api/evaluate` validates a trimmed task of 1–2,000 characters and makes one server-side request to TypeSafe's `/v1/systemone`. The request includes `model: "jev-latest"`, the task as `state`, and one `noul` question asking whether Jev is appropriate for the task, with criteria describing Jev's bounded decision use cases and the exclusion of substantial free-form generation. The API key remains server-side.

Read and validate `answers.fit.noul` as a finite number from 0 to 1. A value at or above 0.5 yields YES; below 0.5 yields NO. Display the chosen side's probability as “Probability toward this answer,” including values near 50%. Noul has no separate confidence field; do not claim this measures real task success. Time the HTTP request and label it observed request time. Use a short request timeout.

## Existing project changes

Reuse the Next.js app, task input, selected examples, dark styling, metadata, and copy interaction. Simplify the Jev client, API response, page, About content, share text, and related tests. Remove Laya integration, cross-examination, Double Jeopardy, simulation heuristics, synthesis logic, and components/tests used only by those features. Keep the in-memory rate limit only as a basic local safeguard; assess a hosted rate limit before a public traffic push.

## Completion checks

1. A real Jev response determines the visible verdict using the official response shape.
2. Missing credentials, timeout, upstream errors, and malformed responses show errors, never a simulated answer.
3. Input examples, copy text, and desktop/mobile layout work.
4. Tests cover the request/response mapping and main error paths; TypeScript and production build pass.
5. README states setup, the exact question, the decision rule, and the experiment disclaimer.

## Deferred

Laya, other-model comparisons, reconsideration, result persistence, analytics, and a general model recommendation engine are outside this release.
