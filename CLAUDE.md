# CLAUDE.md

This file provides project-specific guidance for Claude Code and other AI coding agents working in this repository.

## Project overview

Beyond Blackboard is a Korean-language web application prototype for reducing teachers' repetitive administrative work. The current codebase is a frontend-focused Next.js app for school/class administration workflows such as:

- dashboard with education news, calendar, and todos
- document template discovery/generation UI
- student management
- attendance management
- evaluation/grading assistant
- school record assistant

The README also describes future AI document generation, evaluation scoring, complaint handling, authentication, database integration, and file conversion features. Treat those as roadmap items unless they are present in the source code.

## Current implementation status

This repository is currently a Next.js frontend app, not a full-stack production system.

- Implemented source lives under `src/`.
- No backend API, database schema, auth system, or real AI integration is currently present.
- Most data is local/static in React components or `src/constants/index.ts`.
- UI copy and domain language are primarily Korean.
- The project appears to use sample/mock dates and content in several places.

When adding features, be careful not to imply that planned backend or AI features already exist.

## Tech stack

- Framework: Next.js 15 App Router
- Language: TypeScript
- React: React 19
- Styling: Tailwind CSS
- UI/icon libraries: Headless UI, Heroicons, Lucide React
- Linting: ESLint 9 with Next.js core web vitals and TypeScript config

## Useful commands

Run these from the repository root.

```bash
npm run dev
npm run build
npm run lint
npm run type-check
```

Notes:

- `npm run dev` starts Next.js with Turbopack.
- `npm run build` is the main production verification command.
- `npm run lint` currently maps to `next lint`; verify compatibility if Next.js lint command behavior changes.
- `npm run clean` removes `.next` and `dist`.

## Repository structure

```text
beyond-blackboard/
├── src/
│   ├── app/
│   │   ├── attendance/
│   │   ├── documents/
│   │   ├── evaluation/
│   │   ├── grades/
│   │   ├── records/
│   │   ├── students/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── layout/
│   │   └── ui/
│   ├── constants/
│   └── types/
├── public/
├── README.md
├── package.json
├── next.config.ts
└── eslint.config.mjs
```

The README may mention directories or pages that are planned but not currently present. Prefer the actual filesystem and source code as the source of truth.

## Coding conventions

- Use TypeScript for all app code.
- Use React function components.
- Prefer PascalCase for component files and component names.
- Prefer camelCase for functions and variables.
- Prefer UPPER_SNAKE_CASE for true constants.
- Keep Korean user-facing copy natural and teacher-friendly.
- Keep reusable domain types in `src/types/index.ts`.
- Keep shared static menu/template data in `src/constants/index.ts`.
- Use the existing Tailwind-based styling approach before introducing new styling systems.
- Use the `@/` import alias for source imports where appropriate.

## UI and product guidance

- The product is for teachers, so prioritize clarity, calmness, and low cognitive load.
- Avoid overly technical language in visible UI copy.
- Preserve the green primary brand direction currently represented by `#1ccf60` and related Tailwind classes unless intentionally redesigning the brand.
- Mobile/responsive behavior matters; existing layout components include header, sidebar, and mobile menu concepts.
- If adding new workflows, keep mock/demo data clearly separated from future real API integration points.

## Architecture guidance

The current app is simple and component-driven. Keep changes proportional to the existing codebase.

- Do not add a backend, database, auth provider, or AI provider unless explicitly requested.
- Do not introduce global state libraries unless local state or simple props become insufficient.
- Avoid broad rewrites of layout, routing, or styling for small feature changes.
- Keep page-specific UI in the relevant `src/app/**/page.tsx` file until it becomes reusable.
- Extract reusable UI to `src/components/ui/`.
- Extract shared layout/navigation concerns to `src/components/layout/`.

## Verification expectations

Before handing off meaningful code changes, run verification proportional to the change:

- For TypeScript or React changes: `npm run type-check`
- For UI/component changes: `npm run build`
- For lint-sensitive changes: `npm run lint`

If a command fails because of an existing issue unrelated to the change, report it clearly and include the relevant error.

## Important cautions for agents

- Do not edit generated output under `.next/`.
- Do not modify `node_modules/`.
- Preserve user changes in the working tree.
- Check actual files before relying on README claims.
- Treat future roadmap items in README as planned, not implemented.
- When adding files, keep naming and folder placement consistent with the existing app.
- Avoid committing secrets, API keys, school/student personal data, or real private records.

