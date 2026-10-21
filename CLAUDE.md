# CLAUDE.md

## Project Snapshot

`siempre-app-wp` is an internal React application used to process package spreadsheets and prepare WhatsApp communication flows for delivery notifications.

## Stack

- React 19
- Vite
- TypeScript
- Material UI
- Vitest + Testing Library
- Playwright

## Important Paths

- `src/router.tsx` route definitions
- `src/components/pages/` UI screens for upload and operational table flow
- `src/context/CSVContext.tsx` shared CSV state
- `src/services/` message generation helpers and business rules
- `src/utils/` CSV parsing logic
- `e2e/` Playwright smoke coverage

## Commands

```bash
npm install
npm run dev
npm run build
npm run lint
npm run test:coverage
npm run test:e2e
```

## Working Rules

- Preserve the CSV contract unless the parsing, tests, and user flow are updated together.
- Prefer keeping business rules in `services/` and parsing concerns in `utils/`.
- Any UI change that affects the main package workflow should keep or extend the smoke coverage.
- Generated Playwright artifacts should stay out of versioned changes.

## Suggested Next Improvements

1. Add a dedicated import schema validator with clearer user-facing error messages.
2. Centralize route constants to avoid hardcoded path drift.
3. Expand e2e coverage beyond the smoke path once the happy flow is fully stable.

<!-- dotclaude -->
## Harness: dotclaude

Este repo se trabaja con la config de Claude Code / Codex de [agusnarvaez/dotclaude](https://github.com/agusnarvaez/dotclaude)
(privado): reglas compartidas, headroom (compresión de contexto) y graphify (grafo de código).

- PC nueva: `gh repo clone agusnarvaez/dotclaude ~/.claude-sync && bash ~/.claude-sync/bin/bootstrap.sh`
- Verificar: `headroom doctor`. Las reglas globales viven en `~/.claude/rules/` (Codex: `~/.codex/AGENTS.md`).
