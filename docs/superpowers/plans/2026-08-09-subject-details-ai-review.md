# 세부특기사항 AI 검토 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a Phase-1 demo where teachers upload student source text for 과목별 세부특기사항, the app auto-matches students and pre-builds AI-style drafts (mock), notifies in-app, and lets teachers edit both panes then copy text for NEIS paste.

**Architecture:** Front orchestration on Next.js App Router: upload → `IngestParser` → `StudentMatcher` → `MockDraftProvider` → `subjectDetailJobStore` → `NotifyHub` → batch review UI at `/records/subject-details`. Phase 2 swaps in `OllamaDraftProvider` behind the same interface via a thin Route Handler.

**Tech Stack:** Next.js 15.4.6, React 19, TypeScript, Tailwind Soft UI, existing `createSingletonStore` + localStorage, Vitest for pure TS unit tests, Playwright MCP / manual browser for E2E smoke.

## Global Constraints

- Spec: `docs/superpowers/specs/2026-08-09-subject-details-ai-review-design.md`
- No Drive OAuth, FCM, cloud LLM, or real NEIS in Phase 1
- Primary path must NOT be “press AI to generate”; drafts exist when status is `ready`
- Both `rawText` and `aiText` are editable
- Copy default = AI draft; secondary action may copy original
- Korean teacher-facing copy; Soft UI tokens (`cp-*`, surfaces)
- Follow `@/` imports and `src/lib/workspace/` patterns
- Do not invent a backend DB

## File map

| Path | Responsibility |
|------|----------------|
| `src/lib/workspace/subjectDetailTypes.ts` | Job/entry types |
| `src/lib/workspace/ingestParser.ts` | CSV + txt → fragments |
| `src/lib/workspace/studentMatcher.ts` | Fragments → studentId / unmatched |
| `src/lib/workspace/draftProvider.ts` | Interface + Mock + (P2) Ollama client |
| `src/lib/workspace/notifyHub.ts` | Append in-app notices |
| `src/lib/workspace/appNoticeStore.ts` | Persisted notices for Header bell |
| `src/lib/workspace/subjectDetailJobStore.ts` | Jobs CRUD + pipeline runner |
| `src/lib/workspace/subjectDetailPrompt.ts` | Prompt meta / mock transform rules |
| `src/app/records/[id]/page.tsx` | If `id===subject-details` render hub; else keep single draft UI |
| `src/components/records/SubjectDetailsHub.tsx` | Upload + 3-pane review UI |
| `src/components/layout/Header.tsx` | Merge `appNoticeStore` with static NOTICES |
| `src/app/api/ai/draft/route.ts` | Phase 2 only — Ollama proxy |
| `src/lib/workspace/__tests__/ingestParser.test.ts` | Parser tests |

---

### Task 1: Types + ingest parser (TDD)

**Files:**
- Create: `src/lib/workspace/subjectDetailTypes.ts`
- Create: `src/lib/workspace/ingestParser.ts`
- Create: `src/lib/workspace/__tests__/ingestParser.test.ts`
- Modify: `package.json` (add `vitest`, script `test`)

**Interfaces:**
- Produces:
  - `parseCsv(text: string): { ok: true; fragments: IngestFragment[] } | { ok: false; error: string }`
  - `parseTxtFile(filename: string, text: string): IngestFragment`
  - `type IngestFragment = { studentName: string; studentNumber?: string; rawText: string }`

- [ ] **Step 1: Add Vitest**

```bash
cd /Users/sjw/ted.urssu/beyond-blackboard
npm install -D vitest
```

Add to `package.json` scripts: `"test": "vitest run"`, `"test:watch": "vitest"`.

Add `vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: { environment: "node" },
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
});
```

- [ ] **Step 2: Write failing parser tests**

```ts
import { describe, it, expect } from "vitest";
import { parseCsv, parseTxtFile } from "../ingestParser";

describe("parseCsv", () => {
  it("parses header + rows", () => {
    const csv = `studentName,studentNumber,rawText
홍길동,202401001,"수학을 좋아함"
이영희,,토론에 적극적`;
    const r = parseCsv(csv);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.fragments).toHaveLength(2);
    expect(r.fragments[0].studentName).toBe("홍길동");
    expect(r.fragments[0].rawText).toContain("수학");
  });

  it("rejects empty body", () => {
    const r = parseCsv("studentName,rawText\n");
    expect(r.ok).toBe(false);
  });
});

describe("parseTxtFile", () => {
  it("uses filename stem as name", () => {
    const f = parseTxtFile("김철수.txt", "성실함");
    expect(f.studentName).toBe("김철수");
    expect(f.rawText).toBe("성실함");
  });
});
```

- [ ] **Step 3: Run tests — expect FAIL**

Run: `npm test -- src/lib/workspace/__tests__/ingestParser.test.ts`  
Expected: FAIL (module missing)

- [ ] **Step 4: Implement types + parser**

`subjectDetailTypes.ts` — copy Job/Entry types from spec.  
`ingestParser.ts` — UTF-8 CSV split on first-line headers; require `studentName` + `rawText`; skip blank rows; quoted fields supported minimally.

- [ ] **Step 5: Run tests — expect PASS**

Run: `npm test -- src/lib/workspace/__tests__/ingestParser.test.ts`  
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json vitest.config.ts \
  src/lib/workspace/subjectDetailTypes.ts \
  src/lib/workspace/ingestParser.ts \
  src/lib/workspace/__tests__/ingestParser.test.ts
git commit -m "feat: 세부특기사항 CSV/txt 인제스트 파서"
```

---

### Task 2: Matcher + MockDraftProvider + NotifyHub stores

**Files:**
- Create: `src/lib/workspace/studentMatcher.ts`
- Create: `src/lib/workspace/draftProvider.ts`
- Create: `src/lib/workspace/subjectDetailPrompt.ts`
- Create: `src/lib/workspace/appNoticeStore.ts`
- Create: `src/lib/workspace/notifyHub.ts`
- Create: `src/lib/workspace/subjectDetailJobStore.ts`
- Test: `src/lib/workspace/__tests__/studentMatcher.test.ts`
- Test: `src/lib/workspace/__tests__/mockDraftProvider.test.ts`

**Interfaces:**
- Consumes: `IngestFragment`, `studentStore.list()`
- Produces:
  - `matchFragment(f, students): { studentId?: string; unmatchedName?: string }`
  - `DraftProvider.generate(input: { rawText: string }): Promise<string>`
  - `createMockDraftProvider(): DraftProvider`
  - `getActiveDraftProvider(): DraftProvider` (reads env / flag; default mock)
  - `appNoticeStore.add(notice: { id; title; body; href?; createdAt })`
  - `subjectDetailJobStore.createFromFragments(fragments): jobId` then async `runPipeline(jobId)`

- [ ] **Step 1: Failing matcher + mock draft tests**

```ts
// studentMatcher: exact name match to seeded 홍길동
// mockDraft: non-empty, not identical necessarily, strips excess whitespace, max length soft
```

- [ ] **Step 2: Implement matcher** — prefer `studentNumber` then exact `name` trim; else unmatchedName.

- [ ] **Step 3: Implement MockDraftProvider** — normalize whitespace; ensure ends with period/다.; prefix nothing; apply simple template sentence polish (e.g. join short lines). Keep deterministic for tests.

- [ ] **Step 4: appNoticeStore** — `createSingletonStore` + `persistKey: "cp.workspace.appNotices"`; `add`, `list`, `markRead` optional.

- [ ] **Step 5: notifyHub.onJobReady(job)** — add notice title `학생들의 세부특기사항 작성이 완료되었습니다`, href `/records/subject-details?job=${job.id}`.

- [ ] **Step 6: subjectDetailJobStore** — create job `ingesting` → map fragments via matcher → `drafting` → for each entry `aiText = await provider.generate` → `ready` → notifyHub. Persist `cp.workspace.subjectDetailJobs`. Methods: `updateEntry`, `setReviewStatus`, `getById`, `linkStudent(entryId, studentId)`.

- [ ] **Step 7: `npm test` PASS + commit**

```bash
git commit -m "feat: 세부특기사항 job store·mock draft·앱 알림 허브"
```

---

### Task 3: Header bell uses appNoticeStore

**Files:**
- Modify: `src/components/layout/Header.tsx`

**Interfaces:**
- Consumes: `useSingletonStore(appNoticeStore)`, existing `NOTICES`

- [ ] **Step 1: Merge lists** — `const items = [...appNotices, ...NOTICES]` (dynamic first). Badge count = items.length (or unread if implemented).

- [ ] **Step 2: ListItem click** — if `href`, `router.push(href)` and close panel.

- [ ] **Step 3: Manual smoke** — temporarily `appNoticeStore.add(...)` from console or unit; bell shows Korean title.

- [ ] **Step 4: Commit**

```bash
git commit -m "feat: 헤더 알림에 동적 세부특기사항 완료 알림 연결"
```

---

### Task 4: SubjectDetailsHub UI + route wiring

**Files:**
- Create: `src/components/records/SubjectDetailsHub.tsx`
- Modify: `src/app/records/[id]/page.tsx`

**Interfaces:**
- Consumes: `subjectDetailJobStore`, `studentStore`, `useSearchParams` for `job`

- [ ] **Step 1: Route gate** — if `id !== "subject-details"`, keep existing single-student draft page; else render `<SubjectDetailsHub />`.

- [ ] **Step 2: Hub upload zone** — file input accept `.csv,text/csv,.txt`; on change read as text; CSV via `parseCsv`; multiple txt via `parseTxtFile`; on error show Field error; on success `createFromFragments` + `runPipeline`.

- [ ] **Step 3: Status banner** — show ingesting/drafting/ready/failed.

- [ ] **Step 4: Desktop layout** — left list (name from studentStore or unmatchedName; chips); center two textareas `rawText` / `aiText`; onChange marks `edited`; Save calls `updateEntry`.

- [ ] **Step 5: Actions** — Copy AI (`navigator.clipboard.writeText`) → `reviewStatus=copied` + Snackbar “나이스에 붙여넣으세요”; secondary copy raw; Next selects next entry.

- [ ] **Step 6: Unmatched** — Select to link to `studentStore` student.

- [ ] **Step 7: `?job=`** — select that job on mount.

- [ ] **Step 8: `npm run type-check` + browser smoke (upload sample CSV)**

- [ ] **Step 9: Commit**

```bash
git commit -m "feat: 세부특기사항 배치 검토 허브 UI"
```

---

### Task 5: Sample fixture + demo verification loop

**Files:**
- Create: `public/fixtures/subject-details-sample.csv`
- Modify: hub UI optional “샘플 불러오기” button reading that fixture via fetch

- [ ] **Step 1: CSV with ≥3 rows** matching seeded students where possible (홍길동, 이영희, …).

- [ ] **Step 2: Run checklist from spec success criteria** (manual or Playwright MCP):
  1. Upload → ready without AI button
  2. Bell notice → opens job
  3. Edit both panes → refresh persists
  4. Copy AI text

- [ ] **Step 3: Commit**

```bash
git commit -m "chore: 세부특기사항 데모용 샘플 CSV"
```

---

### Task 6 (Phase 2): Ollama DraftProvider + API route

**Files:**
- Create: `src/app/api/ai/draft/route.ts`
- Modify: `src/lib/workspace/draftProvider.ts` — `createOllamaDraftProvider`, `getActiveDraftProvider` uses `process.env.AI_DRAFT_PROVIDER=ollama`
- Modify: `.env.example` — `AI_DRAFT_PROVIDER=mock|ollama`, `OLLAMA_BASE_URL=http://127.0.0.1:11434`, `OLLAMA_MODEL=...`

**Interfaces:**
- `POST /api/ai/draft` body `{ rawText: string }` → `{ aiText: string }`
- Ollama provider calls that route from browser OR server-side only from pipeline (prefer server: job store pipeline calls provider; Ollama provider uses `fetch` to localhost from Route Handler only — browser calls `/api/ai/draft`)

- [ ] **Step 1: Route Handler** proxies chat generate to Ollama; on failure return 503 JSON `{ error }`.

- [ ] **Step 2: OllamaDraftProvider** — fetch `/api/ai/draft`; on fail throw; job store catch → `aiText = rawText` + set entry error flag / Callout.

- [ ] **Step 3: Manual test with Ollama running** — drafts differ from mock.

- [ ] **Step 4: Commit**

```bash
git commit -m "feat: Ollama DraftProvider로 세부특기사항 초안 생성"
```

---

### Task 7: PR

- [ ] **Step 1:** `npm run type-check && npm test && npm run lint`
- [ ] **Step 2:** Push branch + `gh pr create` summarizing Phase 1 (+ Phase 2 if included)
- [ ] **Step 3:** Post-Flow Audit `/postflow-audit` on critical path upload→notify→copy

---

## Spec coverage check

| Spec item | Task |
|-----------|------|
| CSV/txt ingest | 1 |
| Student match | 2 |
| Mock then Ollama provider | 2, 6 |
| Job pipeline statuses | 2 |
| In-app notify | 2, 3 |
| Hub 3-pane, both editable | 4 |
| Clipboard NEIS copy | 4 |
| Sample + success criteria | 5 |
| Phase 2 local LLM | 6 |

## Placeholder scan

None intentional. Phase 2 is explicit Task 6, not TBD.
