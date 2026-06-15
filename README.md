# alert-rule-engine

[![CI](https://github.com/w2030298-art/alert-rule-engine/actions/workflows/ci.yml/badge.svg)](https://github.com/w2030298-art/alert-rule-engine/actions/workflows/ci.yml)

TypeScript library for defining and evaluating metric-based alert rules. The
project is currently a strict ESM TypeScript library/CLI scaffold: the public
core contract is defined, while validation and full evaluation behavior are
implemented incrementally in follow-up work.

## Requirements

- Node.js `>=20.11.0`
- npm, using the committed `package-lock.json`

## Installation

```bash
git clone https://github.com/w2030298-art/alert-rule-engine.git
cd alert-rule-engine
npm ci
```

## alert-engine usage

Create an engine from a fixed rule set, handle the typed `Result`, then ingest
metric readings through the returned engine.

```ts
import {
  createEngine,
  type MetricReading,
  type Rule,
} from './src/core/index.js';

const rules: Rule[] = [
  {
    kind: 'threshold',
    id: 'high-cpu',
    metric: 'cpu.usage',
    op: '>',
    value: 90,
    forMs: 60_000,
  },
];

const result = createEngine(rules);
if (!result.ok) {
  for (const err of result.error) {
    console.error(err.code, err.ruleId, err.field, err.message);
  }
  process.exitCode = 1;
} else {
  const reading: MetricReading = {
    metric: 'cpu.usage',
    value: 95,
    ts: Date.now(),
  };

  const events = result.value.ingest(reading);
  const status = result.value.snapshot();

  console.log({ events, status });
}
```

## Rule JSON example

Rules are discriminated by `kind`. The current public contract supports
threshold, rate-of-change, and absence rules.

```json
[
  {
    "kind": "threshold",
    "id": "high-cpu",
    "metric": "cpu.usage",
    "op": ">",
    "value": 90,
    "forMs": 60000
  },
  {
    "kind": "rateOfChange",
    "id": "temperature-spike",
    "metric": "sensor.temperature",
    "windowMs": 300000,
    "delta": 5
  },
  {
    "kind": "absence",
    "id": "missing-heartbeat",
    "metric": "device.heartbeat",
    "withinMs": 120000
  }
]
```

## Public contract quick reference

The public surface is exported from [`src/core/index.ts`](./src/core/index.ts).

- [`createEngine`](./src/core/engine.ts) creates an `Engine` from `Rule[]` and
  returns `Result<Engine, RuleValidationError[]>`.
- [`Engine`](./src/core/engine.ts) exposes `ingest(reading)` for new metric
  samples and `snapshot()` for current alert states.
- [`Rule`](./src/core/types.ts) is the union of `ThresholdRule`,
  `RateOfChangeRule`, and `AbsenceRule`.
- [`MetricReading`](./src/core/types.ts), [`AlertEvent`](./src/core/types.ts),
  and [`AlertStatus`](./src/core/types.ts) define the runtime data shapes.
- [`Result`](./src/core/errors.ts) and
  [`RuleValidationError`](./src/core/errors.ts) define expected validation
  failure handling.

## Error strategy

Fallible operations (notably `createEngine`) return a **`Result<T, E>`** discriminated union instead of throwing exceptions for expected failures such as invalid rule configuration.

```ts
const result = createEngine(rules);
if (!result.ok) {
  for (const err of result.error) {
    console.error(err.code, err.message);
  }
  return;
}
const engine = result.value;
```

This keeps validation errors **explicit, typed, and batchable** — callers must handle `ok: false` at the type level rather than relying on `try/catch`. See JSDoc in `src/core/errors.ts` for the full rationale.

## Development

```bash
npm install
npm run typecheck
npm run lint
npm test
npm run build
```

Use `npm ci` in fresh clones or CI for lockfile-exact installs. Use
`npm install` when intentionally updating dependencies.

## Testing

```bash
npm run typecheck
npm run lint
npm test
```

Coverage is available with:

```bash
npm run test:cov
```

## Collaboration conventions

- Branch names use scoped prefixes: `feat/...`, `fix/...`, or `chore/...`.
- Commit messages follow Conventional Commits, for example
  `feat: add threshold rule validation`, `fix: handle empty metric names`, or
  `chore: update tooling`.
- Pull requests should link the related issue, update `CHANGELOG.md` when the
  user-facing or contributor-facing behavior changes, and pass typecheck, lint,
  and test commands before review.
