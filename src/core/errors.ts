/**
 * Error types and the `Result` discriminated union for fallible operations.
 *
 * ## Why `Result` instead of exceptions?
 *
 * Rule validation is an **expected, recoverable** outcome: callers supply
 * configuration that may be invalid, and the engine must report structured
 * errors (per-rule, per-field) without aborting the process. `Result<T, E>`
 * makes that path explicit in the type signature — `createEngine` either
 * returns an `Engine` or a `RuleValidationError[]`, never both and never
 * via a thrown exception.
 *
 * Benefits for this library:
 * - **Typed errors**: consumers pattern-match on `{ ok: false; error }` instead
 *   of catching untyped `Error` instances.
 * - **No hidden control flow**: validation failures cannot be accidentally
 *   swallowed by a broad `catch`; they must be handled at the call site.
 * - **Composable**: multiple validation errors accumulate in one array rather
 *   than throwing on the first failure (batch feedback for config authors).
 * - **Predictable runtime**: the engine avoids try/catch in hot paths; only
 *   truly unexpected defects (programmer bugs) should throw.
 */

/** Success or failure without exceptions for expected error paths. */
export type Result<T, E> = { ok: true; value: T } | { ok: false; error: E };

/** Structured validation failure for a single rule field or constraint. */
export interface RuleValidationError {
  /** Machine-readable error code (e.g. `INVALID_THRESHOLD`). */
  code: string;
  /** Rule identifier, when the error pertains to a specific rule. */
  ruleId?: string;
  /** Field path within the rule object, when applicable. */
  field?: string;
  /** Human-readable description suitable for logs or UI. */
  message: string;
}
