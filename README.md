# alert-rule-engine

TypeScript library for evaluating metric-based alert rules.

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
