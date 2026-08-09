# Post-Flow Audit — Reference Checklists

Use from [SKILL.md](SKILL.md). Skip items that cannot apply; mark axis `N/A` with reason.

## 1. 전체 상태 (Overall)

- [ ] `type-check` / `lint` / `build` (or project equivalents) clean for touched areas
- [ ] App boots; health or home URL returns success
- [ ] Critical routes HTTP 200 (or expected auth redirect)
- [ ] No uncaught console errors on critical path
- [ ] Env: required vars documented; no `.env` committed
- [ ] Feature flags / mock vs live data clearly separated

## 2. UI 접근성 (Accessibility)

- [ ] Interactive elements reachable by keyboard (Tab/Shift+Tab)
- [ ] Visible focus; no `outline: none` without replacement
- [ ] Buttons/links/icon-only controls have accessible names
- [ ] Form fields have labels; errors tied to fields
- [ ] Images: meaningful `alt` or decorative empty alt
- [ ] Dialogs: focus trap / Escape / `aria-modal` as appropriate
- [ ] Contrast: text vs background adequate on Soft UI / brand surfaces
- [ ] `prefers-reduced-motion` respected for non-essential motion
- [ ] Landmarks: header/main/nav; heading order sane

## 3. UX 환경 (UX environment)

- [ ] Visual hierarchy: page vs elevated vs card (or design tokens) readable
- [ ] Primary CTA: one high-emphasis action per view
- [ ] Affordance: clickable looks clickable; no fake `cursor-pointer`
- [ ] Empty / loading / error / success states exist for core tasks
- [ ] Mobile: no broken overflow; touch targets ≥ ~40px where icon-only
- [ ] Floating shells (header, sidebar, menus, modals) have **opaque** surfaces
- [ ] Copy language matches product (e.g. Korean teacher-facing)

## 4. 반응속도 (UI responsiveness)

- [ ] First meaningful paint feels usable on critical route
- [ ] No long main-thread blocks on primary interaction
- [ ] Images sized/optimized; no huge uncompressed assets on path
- [ ] Lists virtualized or paginated if large
- [ ] Spinners/disabled state on submits; no double-submit
- [ ] Bundle: obvious dead weight or duplicate libs noted if observed

## 5. API 콜 속도 (API latency)

- [ ] Critical calls: TTFB / total time recorded (approx OK)
- [ ] No duplicate identical calls on single screen mount
- [ ] Waterfall: avoid sequential chains when parallel possible
- [ ] Caching/ETag/stale policy sensible for read-heavy endpoints
- [ ] Errors: timeouts and 4xx/5xx surfaced to UI
- [ ] Payload size not absurd for list endpoints

If no API: **N/A** — frontend mock/demo only.

## 6. DB 상태 (Database)

- [ ] Schema/migrations apply cleanly on empty + existing DB
- [ ] Hot queries have indexes; no obvious N+1 in critical path
- [ ] Connection errors handled; pool not exhausted in smoke use
- [ ] Migrations reversible or documented forward-only
- [ ] Backups / restore story known for staging/prod
- [ ] No PII in logs; seed data clearly fake

If no DB: **N/A**.

## 7. 보안 (Security)

- [ ] No secrets in repo, client bundle, or screenshots
- [ ] Authn/authz on sensitive routes (IDOR check on `[id]` resources)
- [ ] XSS: user HTML escaped; CSP if present
- [ ] CSRF strategy for cookie sessions
- [ ] SQL/NoSQL injection: parameterized queries
- [ ] Security headers (at least on deployed env): HTTPS, frame, etc.
- [ ] Dependency vulnerabilities: known critical/high noted
- [ ] File upload: type/size limits if applicable
- [ ] Admin/debug endpoints not exposed publicly

## Severity guide

| Level | Meaning |
|-------|---------|
| blocker | Flow broken, security exploit, data loss risk |
| major | Serious UX/a11y/perf debt before launch |
| minor | Polish; schedule soon |
| info | Observation; no action required |

## Evidence snippets

Prefer:

- `path:line` for code
- URL + status for HTTP
- Metric + condition for perf (e.g. "list API ~1.8s on local")
- Console message quote for runtime errors
