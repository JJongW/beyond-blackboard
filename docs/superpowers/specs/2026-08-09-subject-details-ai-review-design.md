# Design: 세부특기사항 AI 사전작성 · 검토 · 나이스 복사

**Date:** 2026-08-09  
**Status:** Approved (user 2026-08-09)  
**Scope slice:** 생기부 — 과목별 세부특기사항 only (vertical demo)

## Problem

Teachers should not press a button to “run AI.” Student source text arrives from files; the service ingests, matches students, and **pre-generates** form-compliant drafts. The teacher gets an in-app notice, reviews/edits **both** original and AI text, then copies into NEIS (no real NEIS API).

## Locked decisions

| Topic | Choice |
|-------|--------|
| Product slice | 과목별 세부특기사항 end-to-end demo |
| Ingest | File upload (CSV / multi-txt); Drive OAuth later |
| AI | Phase 1 `MockDraftProvider` → Phase 2 `OllamaDraftProvider` (same interface) |
| Notifications | In-app header bell (+ slot for Web Push later) |
| Architecture | Front orchestration on existing Next + workspace stores |
| NEIS | Clipboard copy only |
| Original text | Editable (not read-only) |
| AI text | Editable |

## Architecture

```
UI (App Router)
  → subjectDetailJobStore (+ localStorage)
  → pipeline: IngestParser → StudentMatcher → DraftProvider → NotifyHub
  → DraftProvider: Mock (P1) | Ollama via thin Route Handler (P2)
```

- Upload creates a job; client runs pipeline asynchronously in-page (`ingesting` → `drafting` → `ready` / `failed`).
- User never triggers “generate” as the primary path; drafts exist before review.
- “Agents” in v1 = **module boundaries**, not a multi-process agent runtime. Optional Review pass (length/banned phrases) is a Phase-2 slot.

### Modules

| Module | Responsibility |
|--------|----------------|
| `IngestParser` | File(s) → raw fragments `{ name, studentNumber?, rawText }` |
| `StudentMatcher` | Fragments → `studentStore` ids or unmatched |
| `DraftProvider` | `generate({ rawText, meta }) → aiText` |
| `NotifyHub` | On `ready`, append in-app notice |

## UI / routes

- Hub: `/records/subject-details` becomes the **batch review** workspace (replaces single free-text stub for this template).
- Deep link from bell: `/records/subject-details?job=<id>`.

**Layout (desktop)**

- Left: student list (match chip + review chip).
- Center: **Original** textarea (editable) + **AI draft** textarea (editable).
- Actions: Save · Copy (AI draft by default; secondary “원본 복사”) · Next student.

**Mobile:** student picker + tabs (원본 | AI) + sticky CTA.

**Review chips:** `pending` | `edited` | `copied`  
**Match chips:** matched | unmatched (manual link UI)

## Data model

```ts
type JobStatus = "ingesting" | "drafting" | "ready" | "failed";

type SubjectDetailJob = {
  id: string;
  status: JobStatus;
  createdAt: string;
  notifiedAt?: string;
  errorMessage?: string;
  entries: SubjectDetailEntry[];
};

type SubjectDetailEntry = {
  id: string;
  studentId?: string;
  unmatchedName?: string;
  rawText: string;   // editable
  aiText: string;    // editable
  reviewStatus: "pending" | "edited" | "copied";
};
```

Persist: `cp.workspace.subjectDetailJobs` (same singleton + localStorage pattern as existing workspace stores).

### Upload formats (Phase 1)

1. **CSV:** headers `studentName,studentNumber?,rawText` (UTF-8).
2. **Multiple `.txt`:** filename hint for name; body = rawText.

Bad rows → unmatched / skippable entries; job continues for good rows.

## Flows

1. Teacher uploads CSV/txt on hub.
2. Pipeline fills entries + mock (then Ollama) drafts.
3. Job `ready` → NotifyHub → bell: “학생들의 세부특기사항 작성이 완료되었습니다.”
4. Teacher opens hub, edits raw and/or AI, saves.
5. Copy AI text → clipboard → toast: paste into NEIS.

## Errors

| Case | Behavior |
|------|----------|
| Empty / invalid file | Block upload; field error |
| Partial unmatched names | Job proceeds; manual match in list |
| Ollama down (P2) | Per-entry fallback `aiText = rawText` + banner; retry control |
| Clipboard denied | Toast + select-all hint |

## Phasing

**Phase 1 — Demo loop (ship first)**  
Upload → match → mock draft → notify → edit both panes → copy. No Ollama required.

**Phase 2 — Local LLM**  
`POST /api/ai/draft` (or similar) proxies to Ollama; swap provider only. Optional Review pass.

**Later (out of this spec)**  
Google Drive watch, Web Push/FCM, cloud LLM, other 생기부 templates, real NEIS.

## Success criteria (demo “done”)

- [ ] CSV with ≥3 students completes to `ready` without user pressing “AI 실행”
- [ ] Bell notice appears and opens the job
- [ ] Both panes editable; save persists across refresh
- [ ] Copy puts AI text on clipboard
- [ ] Phase 2: with Ollama up, drafts differ from mock via same UI

## Testing

- Unit: CSV parser (broken rows, missing columns)
- Store: persist round-trip
- E2E (Playwright): upload → ready → open from notice → edit → copy

## Non-goals

- Multi-tenant auth, server DB, Drive OAuth, native mobile push, AI button-as-primary UX
