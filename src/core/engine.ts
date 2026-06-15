import { assertNever } from './assertNever.js';
import type { Result, RuleValidationError } from './errors.js';
import type { AlertEvent, AlertStatus, MetricReading, Rule } from './types.js';

/**
 * Stateful alert rule evaluator bound to a fixed rule set.
 *
 * Instances are created only via {@link createEngine}; the constructor is not
 * part of the public API.
 */
export interface Engine {
  /**
   * Ingest a metric reading and return any alert state transitions caused by it.
   *
   * @param reading - A single metric sample. The engine matches `reading.metric`
   *   against configured rules.
   * @returns Zero or more {@link AlertEvent} values describing state changes
   *   in this ingestion pass. An empty array means no transitions occurred.
   *
   * **Invariants**
   * - Events are returned in emission order for this call.
   * - Each event's `ruleId` refers to a rule passed to `createEngine`.
   * - `at` on every event is `>= reading.ts` (transitions are not backdated).
   * - Calling `ingest` does not mutate prior events; it only advances internal state.
   */
  ingest(reading: MetricReading): AlertEvent[];

  /**
   * Return the current alert status for every rule in the engine.
   *
   * @returns One {@link AlertStatus} per configured rule, regardless of whether
   *   the rule has received data.
   *
   * **Invariants**
   * - The returned array length equals the number of rules at construction.
   * - Each `ruleId` appears exactly once.
   * - `since` is the epoch ms when the rule entered its current `state`.
   * - Repeated calls without intervening `ingest` calls return equivalent snapshots.
   */
  snapshot(): AlertStatus[];
}

/**
 * Create an engine from a rule configuration.
 *
 * @param rules - Non-empty or empty array of rules to evaluate. Each rule must
 *   have a unique `id` (enforced in WEN-335; not checked in this stub).
 * @returns `ok: true` with a ready {@link Engine} on success, or `ok: false`
 *   with a (possibly empty) list of {@link RuleValidationError} on failure.
 *
 * **Invariants**
 * - On success, the returned engine's `snapshot()` covers exactly the input rules.
 * - Validation is synchronous; no I/O is performed.
 * - This stub accepts all well-typed rules without validation (WEN-335).
 */
export function createEngine(rules: Rule[]): Result<Engine, RuleValidationError[]> {
  for (const rule of rules) {
    switch (rule.kind) {
      case 'threshold':
      case 'rateOfChange':
      case 'absence':
        break;
      default:
        assertNever(rule);
    }
  }

  const engine: Engine = {
    ingest(reading: MetricReading): AlertEvent[] {
      void reading;
      return [];
    },

    snapshot(): AlertStatus[] {
      return [];
    },
  };

  return { ok: true, value: engine };
}
