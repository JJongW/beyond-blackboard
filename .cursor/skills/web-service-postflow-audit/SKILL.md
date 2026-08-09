---
name: web-service-postflow-audit
description: >-
  Re-audits a web service after its end-to-end flow is complete—overall service
  health, UI accessibility, UX environment, UI responsiveness, API latency, DB
  state, and security—then produces a pass/fail scorecard with blockers. Use when
  the user asks for 전체 점검, 플로우 완료 후 재점검, 런칭 전 체크, post-flow
  audit, production readiness, a11y+perf+security sweep, /web-service-postflow-audit,
  or /postflow-audit. Also apply automatically after finishing a multi-step feature
  or critical user-flow implementation (PR-ready handoff), before ending the turn.
---

# Web Service Post-Flow Audit

웹서비스의 전체적인 상태부터 UI의 접근성, 사용자 UX 환경상태, 반응속도, API 콜 속도, DB상태, 보안 점검까지 전체적인 플로우가 완료된 후 다시 해당 서비스를 점검한다.

**Invocation**
- Slash: `/web-service-postflow-audit` or `/postflow-audit`
- Auto: after a multi-step feature/flow is implemented and ready to hand off (see Auto-run policy)

**Hard gate:** Do **not** start domain audits until **Phase 0** confirms the critical user flow completed successfully (or the user explicitly waives a failed step).

**No backend?** Mark API / DB axes `N/A` with evidence (no routes, mock-only). Do not invent servers.

Prefer the user's language for the final report (Korean if they write in Korean).

## Auto-run policy

Run this skill **before ending your turn** when ALL of the following are true:

1. You implemented or substantially finished a **multi-step product flow** (not a one-line typo / pure Q&A / brainstorming-only / design-spec-only turn).
2. The user did **not** already ask only for planning/brainstorming without code.
3. You have **not** already produced a Post-Flow Audit scorecard in this conversation turn chain for this handoff.
4. Status is success-oriented handoff (merged, PR ready, "완료", "ㄱㄱ 끝", shipped locally).

Skip auto-run when: user is mid-grill/brainstorm, only writing specs, asking a question, or explicitly says skip audit.

When auto-running, say briefly that Post-Flow Audit is starting, then follow Phases 0–8.

## When to run

- Feature / flow marked done; user wants a second pass
- Before merge to `main`, staging, or launch
- After Soft UI / a11y / perf / security changes
- Slash command `/postflow-audit` or `/web-service-postflow-audit`

## Phase 0 — Flow complete gate

1. Identify the **critical path** (happy path the work claimed to finish).
2. Execute it (browser MCP / Playwright preferred; curl for APIs).
3. Record: steps, URLs, status codes, console errors, screenshots if useful.
4. **Gate:**
   - Flow **PASS** → continue Phases 1–7
   - Flow **FAIL** → stop domain deep-dives; report blockers + retest plan only (unless user says audit anyway)

## Phase 1–7 — Domain audits (parallelize independent facts)

Work top-down. Pull detailed checklists from [reference.md](reference.md).

| # | Axis | Focus |
|---|------|--------|
| 1 | 전체 상태 | Build/typecheck/lint, env, routes smoke, console/network fatal |
| 2 | UI 접근성 | Keyboard, names/labels, contrast, focus, landmarks, reduced-motion |
| 3 | UX 환경 | Hierarchy, affordance, empty/error/loading, mobile, brand tokens |
| 4 | 반응속도 | LCP/INP/CLS signals, jank, oversized assets, unnecessary re-renders |
| 5 | API 콜 속도 | TTFB, p95 if available, waterfalls, redundant calls, caching |
| 6 | DB 상태 | Migrations, indexes, N+1, pool/errors, backup/restore story |
| 7 | 보안 | Secrets, authz, injection/XSS/CSRF, headers, deps, PII |

For each finding: **severity** `blocker` | `major` | `minor` | `info`, **evidence** (path/URL/metric), **fix** (one line).

## Phase 8 — Re-inspection pass

After Phases 1–7 (and any quick fixes the user approved **in this session**):

1. Re-run **Phase 0** critical path once.
2. Re-check only axes that failed or were fixed.
3. Update the scorecard; do not claim PASS without retest evidence.

## Output scorecard (required)

```markdown
# Post-Flow Audit — <service/repo> — <date>

## Verdict
**GO** | **GO WITH CAVEATS** | **NO-GO**

## Flow gate
- Critical path: <name>
- Result: PASS | FAIL
- Evidence: …

## Scorecard
| Axis | Result | Notes |
|------|--------|-------|
| 전체 상태 | PASS/FAIL/N/A | |
| UI 접근성 | PASS/FAIL/N/A | |
| UX 환경 | PASS/FAIL/N/A | |
| 반응속도 | PASS/FAIL/N/A | |
| API 콜 속도 | PASS/FAIL/N/A | |
| DB 상태 | PASS/FAIL/N/A | |
| 보안 | PASS/FAIL/N/A | |

## Blockers
1. …

## Majors
1. …

## Follow-ups
1. …

## Retest
- Re-ran flow: yes/no — result
```

**Verdict rules**

- Any **blocker** on flow gate, security, or data loss → **NO-GO**
- Only majors/minors → **GO WITH CAVEATS**
- All critical axes PASS (N/A allowed where absent) → **GO**

## Tooling preferences

- Browser: Playwright / IDE browser MCP for flow + a11y snapshots
- HTTP: curl/`fetch` for route/API smoke
- Repo: `package.json` scripts (`lint`, `type-check`, `build`, tests)
- Security: search secrets, auth boundaries, dependency advisories when tools exist
- Never run destructive prod DB commands; prefer read-only checks

## Out of scope

- Redesigning the product mid-audit (report first; fix only if user asks)
- Load testing at scale unless user requests
- Legal/compliance certification (flag risks only)
