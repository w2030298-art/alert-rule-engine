# AGENTS.md

## Cursor Cloud specific instructions

### Project overview
`alert-rule-engine` is a TypeScript (strict, ESM) library/CLI scaffolding project. There are **no runtime services** — no web server, database, queue, or external dependencies. The development workflow is entirely local npm scripts (lint / typecheck / test / build). Node `>=20.11.0` and **npm** (a `package-lock.json` is committed) are required.

### Important repository-state caveat
The default `main` branch is an **empty baseline commit** (no `package.json` or source). All actual scaffolding (`package.json`, `src/`, `test/`, tooling configs) currently lives on an unmerged feature branch. Because of this:
- The startup update script must guard dependency install on `package.json` existing, otherwise it would fail on `main`. The configured update script does this: it runs `npm install` only when `package.json` is present.
- If you need to work against the real code before it is merged, check it out (note the branch name contains non-ASCII characters, so quote it) or use a git worktree.

### Commands (run from the directory that contains `package.json`)
Standard scripts are defined in `package.json`:
- Install deps: `npm install` (or `npm ci` for a clean, lockfile-exact install)
- Lint: `npm run lint`
- Type-check: `npm run typecheck`
- Test (once): `npm test`
- Test + coverage: `npm run test:cov`
- Build (emits to `dist/`): `npm run build`
- Run TS directly (dev runtime): `npx tsx <file>`

### Non-obvious notes
- The project is ESM (`"type": "module"`). Relative imports in `.ts` source intentionally use the `.js` extension (e.g. `from '../src/core/index.js'`) — this is correct for `NodeNext` resolution; do not "fix" them to `.ts`.
- `npx tsx -e "<inline code>"` mis-resolves relative import specifiers from the eval context. To run TS quickly, pass a real file path (`npx tsx path/to/file.ts`) instead of `-e`.
- The built output lands at `dist/src/...` (e.g. `node dist/src/core/index.js`), mirroring the source tree under `dist/`.
