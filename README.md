# Jev vs. Jev

### An AI model interviewing itself for every job.

![Two Spider-Men pointing at each other — the spirit of Jev vs. Jev](public/jev-points-at-jev.jpg)

You describe a task. Jev decides whether **Jev** should do it. Then you get a YES or NO, Jev's probability toward that answer, and how long the request took. That's the whole experiment—and the joke.

**[Try Jev vs. Jev](https://jev-vs-jev.vercel.app/)**

This is a playful self-check, not a scientific benchmark or a promise that Jev can complete the task. There is no second model quietly making the decision for it.

## What can you ask?

Try a bounded decision, such as routing a support ticket or flagging a suspicious payment. Then try asking Jev to write a whole blog post—or the obvious question: *Should Jev decide whether I should use Jev?*

When you get an answer, **Share result** makes a little result card you can download or send from a supported device. It also gives you a link that pre-fills the task for someone else to try. The card preserves your original answer; the link asks Jev again only when the visitor clicks **Ask Jev**, so their answer may differ. The full task is part of the link, so share only text you're comfortable making public.

## Run it yourself

Requires Node.js 18+ and a Jev API key. I used OpenRouter, feel free to chose any of your desired provider:

```bash
npm install
cp .env.example .env.local
```

Create an [OpenRouter key](https://openrouter.ai/keys) and add it to `.env.local`:

```text
OPENROUTER_API_KEY=your_key_here
```

Set a spending limit on that key, keep it out of Git, then run `npm run dev` and open [localhost:3000](http://localhost:3000). The landing page introduces the bit; **Launch Jev** takes you to the checker. Experiential Labs and direct TypeSafe keys are also supported; see [.env.example](.env.example). If more than one key is set, the app chooses OpenRouter, then Experiential Labs, then TypeSafe. Without a key, it shows an error rather than making up an answer.

## What happens under the hood?

`POST /api/evaluate` validates a 1–2,000 character task and sends one request to Jev. OpenRouter uses its `/api/alpha/decisions` endpoint and `typesafe/jev-1.13`; Experiential Labs and TypeSafe use `/v1/systemone` with `jev-latest`. The named `fit` question asks whether the task suits a bounded decision model—classification, routing, ranking, scoring, or verification—rather than substantial open-ended generation.

Jev returns a `noul` yes probability from 0 to 1. The app shows YES at 0.5 or higher, otherwise NO. The displayed percentage is toward the selected answer, not a measured success rate or a separate confidence score. The server rejects malformed responses and keeps the API key out of the browser. The displayed time is observed request time, not a model benchmark.

Application code is in `src/`, tests are in `tests/`, and the landing image is in `public/`. A basic in-memory request limit is included; use a platform-level rate limit for public traffic. For your own deployment, set `OPENROUTER_API_KEY` as a server-side Vercel environment variable and give the key its own spending cap.

```bash
npm test
npm run build
```

## Credits

Built by [Sourav Chandhok](https://www.souravchandhok.dev/). Jev is by [TypeSafe AI](https://typesafe.ai/); this deployment reaches it via [OpenRouter](https://openrouter.ai/).

Laya can join the argument later. For now, it's Jev vs. Jev.
