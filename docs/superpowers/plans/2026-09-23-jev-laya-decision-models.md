# JEV × LAYA: Self-Judging Decision Models Implementation Plan

> Superseded by the Jev-only experiment in `docs/superpowers/specs/2026-09-23-jev-only-design.md`.

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and ship a polished developer-focused experiment where Jev and Laya judge their own suitability for arbitrary user tasks, cross-examine each other in a 2×2 matrix, and re-evaluate their own judgments in Double Jeopardy.

**Architecture:** Next.js App Router (TypeScript + Tailwind CSS) with a robust evaluation engine in server route handlers. Normalized model clients for TypeSafe Jev and Convai Laya with live API integration and a deterministic simulation fallback for local development. Progressive reveal state machine handling Stage A (Self-Judgment), Stage B (Cross-Examination 2×2 Matrix), and Stage C (Double Jeopardy consistency check).

**Tech Stack:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Lucide React, Vitest for automated testing.

**Spec:** Product Requirements Document: "JEV × LAYA: Self-Judging Decision Models" (Scope Lock: v1.0 through v1.3).

---

## Global Constraints

- **Scope Lock:** Complete all functionality for v1.0 (Self-Judgment), v1.1 (Share/Copy + launch polish), v1.2 (Cross-Examination 2×2 Matrix), and v1.3 (Double Jeopardy consistency check).
- **Execution Principles:** Bounded model judgments; deterministic UI logic; strictly no generative LLMs added just to explain results.
- **Latency Presentation:** Elapsed time measured per call and explicitly displayed as "Observed latency" (not a benchmark).
- **Graceful Partial Failure:** Failure in one call/stage must never crash or collapse the entire result.
- **No Account / No DB overhead:** Client-safe state encoding for sharing, zero login or payment requirements.
- **Aesthetic:** Developer-tool aesthetic (dark-mode-first, crisp typography, monospace accents, high-contrast badges).

---

## Architecture & Data Flow

```mermaid
flowchart TD
    User([User submits task]) --> InputValidation[Validate Input length 1-2000 chars]
    InputValidation --> Dispatcher[Evaluation Engine Dispatcher]
    
    subgraph StageA [Stage A: Concurrent Self-Judgment]
        Dispatcher --> CallJevSelf[Jev on Jev: Should Jev handle this?]
        Dispatcher --> CallLayaSelf[Laya on Laya: Should Laya handle this?]
    end
    
    subgraph StageB [Stage B: Cross-Examination]
        Dispatcher --> CallJevLaya[Jev on Laya: Should Laya handle this?]
        Dispatcher --> CallLayaJev[Laya on Jev: Should Jev handle this?]
    end
    
    CallJevSelf & CallLayaSelf --> StageC [Stage C: Double Jeopardy]
    subgraph StageC [Stage C: Double Jeopardy Reconsideration]
        CallJevSelf --> JevReconsider[Jev: Do you agree with your verdict?]
        CallLayaSelf --> LayaReconsider[Laya: Do you agree with your verdict?]
    end
    
    StageA & StageB & StageC --> Synthesis[Rubric & Synthesis Engine]
    Synthesis --> UIState[Progressive UI Reveal: Cards + 2x2 Matrix + Double Jeopardy + Badges]
    UIState --> Share[Copy Formatted Summary / Share URL]
```

---

## Proposed File Structure

```
d:/Grind/Projects/Jev/
├── app/
│   ├── layout.tsx                # Root layout with dark mode, metadata & font
│   ├── page.tsx                  # Main interactive page (Task input, Examples, Progressive Stages)
│   ├── globals.css               # Tailwind CSS theme & developer tool variables
│   ├── api/
│   │   └── evaluate/
│   │       └── route.ts          # Orchestrator endpoint for Stages A, B, and C
│   └── og/
│       └── route.tsx             # Dynamic Open Graph card generator
├── components/
│   ├── Header.tsx                # Clean nav with repo link, about modal trigger, live status
│   ├── TaskInput.tsx             # Natural language prompt textarea with char count & CTA
│   ├── ExamplePrompts.tsx        # 8 clickable preset cards across diverse task shapes
│   ├── StageSelfJudgment.tsx     # Side-by-side cards for Jev on Jev & Laya on Laya
│   ├── StageCrossExam.tsx        # 2x2 matrix (Judge ↓ / Target →) with tension tags
│   ├── StageDoubleJeopardy.tsx   # Consistency check cards (agrees vs flipped)
│   ├── VerdictBadge.tsx          # Reusable YES/NO/UNCERTAIN badge with confidence
│   ├── LatencyTag.tsx            # Monospace observed latency display
│   ├── SignalList.tsx            # Structured 5-signal breakdown (Bounded, Actionable, etc.)
│   ├── CopyShareButton.tsx       # Formatted clipboard copy + URL permalink
│   └── AboutModal.tsx            # Premise, rubric documentation, and experiment disclaimer
├── lib/
│   ├── types.ts                  # Core TypeScript types & schemas (Zod)
│   ├── constants.ts              # 8 example tasks, system prompts, rubric definitions
│   ├── rubric.ts                 # Deterministic template explanation generator
│   ├── synthesis.ts              # Agreement, contradiction, and flip detection logic
│   ├── share.ts                  # Result text formatter and URL compression/decompression
│   ├── clients/
│   │   ├── base.ts               # Shared ModelClient interface
│   │   ├── jev.ts                # TypeSafe Jev API client + simulation engine
│   │   └── laya.ts               # Convai Laya client + simulation engine
│   └── rate-limit.ts             # In-memory IP rate limiter for public route safety
├── tests/
│   ├── rubric.test.ts            # Unit tests for deterministic signal templates
│   ├── synthesis.test.ts         # Unit tests for agreement, disagreement, and flip rules
│   ├── share.test.ts             # Unit tests for result formatting and URL encoding
│   └── evaluate.test.ts          # End-to-end evaluation runner tests
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── README.md
```

---

## Implementation Tasks

### Task 1: Project Scaffolding & Core Typing

**Files:**
- Create: `package.json`, `tsconfig.json`, `tailwind.config.ts`, `postcss.config.mjs`, `app/globals.css`, `app/layout.tsx`
- Create: `lib/types.ts`
- Create: `lib/constants.ts`
- Test: `tests/types.test.ts`

**Interfaces:**
- Consumes: None
- Produces: `EvaluationRequest`, `EvaluationResponse`, `ModelResult`, `SignalResults`, `CrossExamMatrix`, `DoubleJeopardyResult`, `OverallSynthesis`

- [ ] **Step 1: Write test for schema validation and example tasks**
  Write tests in `tests/types.test.ts` verifying Zod schemas for input validation (min 1, max 2000 chars) and ensuring all 8 PRD example tasks are correctly defined.
- [ ] **Step 2: Run test to verify it fails**
  Run `npx vitest run tests/types.test.ts` - fails due to missing files.
- [ ] **Step 3: Initialize Next.js project dependencies and configuration**
  Install Next.js, React, Tailwind CSS, Lucide React, Zod, and Vitest.
- [ ] **Step 4: Implement `lib/types.ts` and `lib/constants.ts`**
  Define complete TypeScript interfaces and Zod schemas for model judgments, signals, cross-exam matrix, and Double Jeopardy.
- [ ] **Step 5: Run tests and verify they pass**
  Verify all types and constants pass tests.
- [ ] **Step 6: Git commit**
  `git commit -m "chore: setup project scaffolding, core types, and constants"`

---

### Task 2: Deterministic Rubric & Synthesis Engine

**Files:**
- Create: `lib/rubric.ts`
- Create: `lib/synthesis.ts`
- Test: `tests/rubric.test.ts`
- Test: `tests/synthesis.test.ts`

**Interfaces:**
- Consumes: `SignalResults`, `ModelResult`, `CrossExamMatrix`, `DoubleJeopardyResult` from `lib/types.ts`
- Produces: `generateExplanation(signals, confidence, verdict): string`, `synthesizeOverallRun(stageA, stageB, stageC): OverallSynthesis`

- [ ] **Step 1: Write unit tests for deterministic rubric explanations**
  Test all PRD Section 9 rules:
  - Bounded + judgment-shaped + no free-form -> "This looks like a bounded decision task."
  - Free-form required -> "This task mainly requires open-ended generation."
  - Low confidence (<60%) -> "The model is uncertain about its fit for this task."
- [ ] **Step 2: Write unit tests for synthesis states**
  Test PRD Section 6 rules:
  - Agreement ("They agree.")
  - Disagreement ("The models disagree 👀")
  - Self vs cross mismatch ("Jev thinks it can. Laya disagrees.")
  - Double Jeopardy flip ("It changed its mind.")
- [ ] **Step 3: Implement `lib/rubric.ts` and `lib/synthesis.ts`**
  Implement pure, deterministic functions without external dependencies.
- [ ] **Step 4: Run tests to verify all rules pass**
  Run `npx vitest run tests/rubric.test.ts tests/synthesis.test.ts`.
- [ ] **Step 5: Git commit**
  `git commit -m "feat: implement deterministic rubric templates and synthesis engine"`

---

### Task 3: Model Clients (Jev & Laya) with Dual Mode (Live + Simulation)

**Files:**
- Create: `lib/clients/base.ts`
- Create: `lib/clients/jev.ts`
- Create: `lib/clients/laya.ts`
- Create: `lib/clients/index.ts`
- Test: `tests/clients.test.ts`

**Interfaces:**
- Consumes: `EvaluationRequest`, `ModelResult`
- Produces:
  - `evaluateJev(task: string, targetModel?: 'jev' | 'laya'): Promise<ModelResult>`
  - `evaluateLaya(task: string, targetModel?: 'jev' | 'laya'): Promise<ModelResult>`
  - `reconsiderJev(task: string, previousResult: ModelResult): Promise<DoubleJeopardyResult>`
  - `reconsiderLaya(task: string, previousResult: ModelResult): Promise<DoubleJeopardyResult>`

- [ ] **Step 1: Write unit tests for model clients**
  Test response normalization, latency tracking, error isolation (simulated failure doesn't throw unhandled exception), and deterministic simulation when keys are absent.
- [ ] **Step 2: Implement `lib/clients/base.ts`**
  Define unified interface with standard timer measurement for "Observed latency".
- [ ] **Step 3: Implement `lib/clients/jev.ts`**
  Connect to TypeSafe Jev API (`https://api.typesafe.ai/v1/systemone`) when `TYPESAFE_API_KEY` is present. Provide high-accuracy decision logic fallback simulating Kahneman System-1 decision boundaries when key is missing.
- [ ] **Step 4: Implement `lib/clients/laya.ts`**
  Connect to Laya endpoint (`LAYA_API_URL`) when configured. Provide ModernBERT decision logic fallback when URL is missing.
- [ ] **Step 5: Run tests and verify both clients adhere to output shapes**
  Ensure latency is recorded in ms, confidence is 0-100%, verdict is YES/NO, and 5 structured signals are populated.
- [ ] **Step 6: Git commit**
  `git commit -m "feat: implement Jev and Laya client adapters with dual live/simulation mode"`

---

### Task 4: Evaluation Orchestrator API & Rate Limiting

**Files:**
- Create: `lib/rate-limit.ts`
- Create: `app/api/evaluate/route.ts`
- Test: `tests/evaluate.test.ts`

**Interfaces:**
- Consumes: `lib/clients/jev.ts`, `lib/clients/laya.ts`, `lib/synthesis.ts`
- Produces: `POST /api/evaluate` supporting single-stage or full-pipeline execution with graceful error fallback.

- [ ] **Step 1: Write integration tests for `/api/evaluate`**
  Test concurrent Stage A execution, Stage B cross-examination, Stage C Double Jeopardy, and partial failure tolerance (if one model throws, the other still succeeds).
- [ ] **Step 2: Implement IP rate limiting in `lib/rate-limit.ts`**
  Prevent public abuse with lightweight sliding-window rate limiter (e.g. 20 requests/minute per IP).
- [ ] **Step 3: Implement `app/api/evaluate/route.ts`**
  Orchestrate:
  1. Validate input prompt with Zod.
  2. Parallel execution of Stage A (Jev->Jev, Laya->Laya).
  3. Parallel execution of Stage B (Jev->Laya, Laya->Jev).
  4. Execution of Stage C (Jev Double Jeopardy, Laya Double Jeopardy).
  5. Compute overall synthesis labels and return complete payload.
- [ ] **Step 4: Run tests to verify parallel execution and error tolerance**
  Run `npx vitest run tests/evaluate.test.ts`.
- [ ] **Step 5: Git commit**
  `git commit -m "feat: implement evaluation orchestrator API route with rate limiting"`

---

### Task 5: Core UI Components & Progressive Reveal Stages

**Files:**
- Create: `components/Header.tsx`
- Create: `components/TaskInput.tsx`
- Create: `components/ExamplePrompts.tsx`
- Create: `components/VerdictBadge.tsx`
- Create: `components/LatencyTag.tsx`
- Create: `components/SignalList.tsx`
- Create: `components/StageSelfJudgment.tsx`
- Create: `components/StageCrossExam.tsx`
- Create: `components/StageDoubleJeopardy.tsx`
- Create: `components/AboutModal.tsx`

**Interfaces:**
- Consumes: Evaluation state, types, synthesis logic
- Produces: Polished, responsive, dark-mode-first developer UI.

- [ ] **Step 1: Implement base display components**
  `VerdictBadge` (bold YES/NO + confidence pill), `LatencyTag` (`⚡ 68ms` in monospace), `SignalList` (5 checklist signals).
- [ ] **Step 2: Implement `TaskInput` and `ExamplePrompts`**
  Large natural-language textarea with character counter, "Ask the Models" primary CTA, loading skeleton, and 8 clickable cards from PRD Section 11.
- [ ] **Step 3: Implement Stage A (`StageSelfJudgment`)**
  Side-by-side cards on desktop, stacked on mobile. Jev theme vs Laya theme. Signals accordion, observed latency badge, and deterministic explanation quote.
- [ ] **Step 4: Implement Stage B (`StageCrossExam`)**
  2×2 judgment matrix:
  - Rows: Judge (Jev, Laya)
  - Columns: Target (Jev, Laya)
  - Clear visual indicator of model consensus or turf war.
- [ ] **Step 5: Implement Stage C (`StageDoubleJeopardy`)**
  Cards displaying the model's reconsideration of its first verdict. Prominent badges: "It changed its mind" vs "Consistent: stands by verdict".
- [ ] **Step 6: Implement `AboutModal`**
  Clear, self-aware explainer: what Jev is, what Laya is, what System-1 typed decision models are, rubric formula disclosure, and explicit disclaimer that this is a playful experiment, not an official benchmark.
- [ ] **Step 7: Git commit**
  `git commit -m "feat: implement UI components and progressive stage reveal containers"`

---

### Task 7: Sharing, Clipboard Formatting & URL State

**Files:**
- Create: `lib/share.ts`
- Create: `components/CopyShareButton.tsx`
- Create: `app/og/route.tsx`
- Test: `tests/share.test.ts`

**Interfaces:**
- Consumes: Complete `EvaluationResponse`
- Produces:
  - `formatResultForClipboard(task, results): string`
  - `encodeTaskToUrl(task): string`
  - `decodeTaskFromUrl(param): string`
  - OG image preview for social platforms (X, LinkedIn, Reddit)

- [ ] **Step 1: Write unit tests for clipboard formatting and URL param encoding**
  Ensure formatted text matches PRD Section 13 format:
  ```
  Task: Route support tickets by department
  Jev on Jev: YES — 96%
  Laya on Laya: YES — 91%
  Jev on Laya: YES — 88%
  Laya on Jev: NO — 62%
  Double Jeopardy: Jev agrees; Laya changed its mind.
  ```
- [ ] **Step 2: Implement `lib/share.ts` and `components/CopyShareButton.tsx`**
  With toast notification ("Copied to clipboard!") and "Share Link" creation.
- [ ] **Step 3: Implement `app/og/route.tsx`**
  Dynamic Open Graph image for social cards displaying the 2x2 matrix outcome.
- [ ] **Step 4: Run tests and verify**
  Run `npx vitest run tests/share.test.ts`.
- [ ] **Step 5: Git commit**
  `git commit -m "feat: implement shareable copy result, URL state hydration, and OG preview"`

---

### Task 8: Main Page Assembly, End-to-End Verification & Polish

**Files:**
- Create/Modify: `app/page.tsx`
- Create: `README.md`
- Test: Full Vitest suite & manual browser verification

**Interfaces:**
- Consumes: All components, API route, sharing utilities
- Produces: Complete, delightful, production-ready web application satisfying all Launch Acceptance Criteria.

- [ ] **Step 1: Wire up `app/page.tsx` state machine**
  Handle:
  - Initial load (with URL task hydration if `?task=...` is present)
  - Example prompt selection
  - Submission & concurrent dispatch
  - Progressive reveal of Stage A -> Stage B -> Stage C
  - Synthesis banner at top ("They agree", "The models disagree 👀", "It changed its mind")
  - Error banner on partial failure
- [ ] **Step 2: Add comprehensive `README.md`**
  Documenting:
  - Premise & recursive joke
  - Bounded System-1 decision architecture (Jev vs Laya)
  - 5-signal rubric formula
  - Setup instructions (with and without API keys)
  - Deployment guide (Vercel)
- [ ] **Step 3: Run full test suite & production build**
  Run `npm test` and `npm run build` to verify zero TypeScript errors and zero lint errors.
- [ ] **Step 4: Git commit**
  `git commit -m "feat: assemble main experience, add documentation, and verify production build"`

---

## Verification Plan

### Automated Tests
- `npx vitest run`:
  - `tests/types.test.ts`: Zod schema validation & prompt boundaries.
  - `tests/rubric.test.ts`: Deterministic signal templates & threshold checks.
  - `tests/synthesis.test.ts`: Cross-examination consensus and Double Jeopardy flip detection.
  - `tests/clients.test.ts`: Model client adapters, latency tracking, error handling.
  - `tests/evaluate.test.ts`: Orchestration API endpoint with parallel stage execution.
  - `tests/share.test.ts`: Copy text output formatting and URL encoding.
- `npm run build`:
  - Next.js production build check ensuring all pages, API routes, and components compile cleanly.

### Manual Verification
1. **Arbitrary User Task:** Enter custom text, verify submission works.
2. **Preset Examples:** Click each of the 8 example prompts (support routing, lead scoring, fraud review, agent tool, sentiment, writing, coding, recursive) and verify accurate verdict & explanations.
3. **Stage A:** Check Jev on Jev and Laya on Laya render side-by-side on desktop, stacked on mobile, with latency in ms and 5 signals.
4. **Stage B:** Reveal 2×2 cross-examination matrix, check all 4 cells (Jev→Jev, Jev→Laya, Laya→Jev, Laya→Laya).
5. **Stage C:** Verify Double Jeopardy section displays consistency / flip status clearly.
6. **Copy Result:** Click "Copy Result", paste into editor, confirm exact PRD format.
7. **Mobile Responsiveness:** Verify layout adapts cleanly to small screens.
8. **Network Error Resilience:** Simulate API timeout / failure and verify the rest of the application remains functional.
