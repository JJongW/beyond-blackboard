# Design: 세부특기사항 오프라인 학습 파이프라인

**Date:** 2026-08-15  
**Status:** Approved for scaffolding  
**Scope:** Offline attempt → score → adopt → SFT/DPO export (prompts filled later by owner)

## Problem

Runtime drafting (Mock / Ollama) does not learn from teacher-finalized text. We need a separate offline loop where one side knows the gold answer and the other explores many prompt/generation strategies, then we adopt winning strategies and export fine-tune datasets.

## Locked decisions

| Topic | Choice |
|-------|--------|
| Online learning in teacher app | No |
| Gold source of truth | JSONL files under `data/subject-details/` |
| Student agent | Ollama chat (no gold in prompt) |
| Training prompts | `src/lib/subjectDetailTrain/promptRegistry.ts` slots (owner fills later) |
| Runtime prompts | Keep `subjectDetailPrompt.ts` until adopt wiring |
| Scorer (v1) | Normalized token Jaccard + length penalty |
| Fine-tune execution | Out of this scaffold — export only; LoRA/Unsloth later |
| Hub auto-capture of gold | Phase C hook only (documented) |

## Architecture

```
Gold JSONL → StudentAgent(Ollama + PromptSlot) → Attempts
Gold + Candidate → Scorer → score
Attempts → Adopt → winning promptId + DPO pairs
Gold → Export SFT; pairs → Export DPO
Adopted promptId ──(later)──► runtime DraftProvider
Export ──(later)──► custom Ollama model → OLLAMA_MODEL
```

### Roles

| Role | Responsibility |
|------|----------------|
| Teacher / Gold | Holds `(rawText, goldText)` finalized 세특 |
| Student | Generates `candidateText` without seeing gold |
| Scorer | `score(candidate, gold) → 0..1` |
| Adopt | Pick best prompt id; build preference pairs |
| Export | Write SFT / DPO JSONL |

## Data schemas

### Gold (`data/subject-details/gold*.jsonl`)

```json
{"id":"g1","rawText":"...","goldText":"...","meta":{"subject":"수학","source":"manual"}}
```

### Attempt

```json
{"goldId":"g1","promptId":"slot-a","temperature":0.2,"candidateText":"...","score":0.81,"createdAt":"..."}
```

### Adopted summary

```json
{"winningPromptId":"slot-a","promptStats":[{"promptId":"slot-a","meanScore":0.8,"n":4}],"dpoPairs":[{"goldId":"g1","rawText":"...","chosen":"...","rejected":"..."}],"createdAt":"..."}
```

### SFT export line

```json
{"rawText":"...","goldText":"..."}
```

### DPO export line

```json
{"rawText":"...","chosen":"...","rejected":"..."}
```

## Attempt loop

1. Load gold rows (cap via `TRAIN_SMOKE_MAX_GOLDS`).
2. For each gold × each `PROMPT_SLOTS` entry × `TRAIN_SMOKE_ATTEMPTS_PER_PROMPT`:
   - Render user message from `userTemplate` with `{{rawText}}`.
   - Call Ollama `/api/chat` with slot `system` (never include `goldText`).
   - Score candidate vs `goldText`.
   - Append attempt JSONL.
3. Adopt: mean score per promptId → `winningPromptId`; for each gold, best vs worst candidate → DPO pair when distinct.
4. Export SFT from gold; DPO from pairs.

If `PROMPT_SLOTS` is empty → smoke exits with a clear message (do not call Ollama).  
If Ollama is down → dry-run validates parse/I/O only.

## Runtime boundary

- Teacher UI continues to use Mock / existing Ollama draft route.
- Training code lives under `src/lib/subjectDetailTrain/` and `npm run train:smoke`.
- Hook for later: `getActiveTrainPromptId()` reads adopted winning id once prompts are filled and adopt has run.

## How to fill prompts (owner)

1. Edit `src/lib/subjectDetailTrain/promptRegistry.ts`.
2. Add one or more `{ id, system, userTemplate }` where `userTemplate` contains `{{rawText}}`.
3. Add real gold rows (copy from `gold.example.jsonl`).
4. Start Ollama, set env, run `npm run train:smoke`.

## Phasing

**Phase A (this PR):** Spec + scaffold + scorer/adopt tests + smoke (empty prompts → blocked message; optional dry-run).

**Phase B:** Owner prompts + gold corpus → smoke/full runs → SFT (then optional DPO) outside app → set `OLLAMA_MODEL` to custom.

**Phase C:** Hub export hook — on save/copy of finalized AI text, append gold JSONL (not implemented here).

## Non-goals

- Continual learning inside each teacher request
- Running LoRA inside Next.js
- Replacing runtime prompts before owner supplies training slots
