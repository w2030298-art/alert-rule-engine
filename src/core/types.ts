/**
 * Domain types for the alert rule engine public contract.
 *
 * These shapes are stable API surface — evaluation and validation logic
 * build on them without changing their structure (see WEN-335, WEN-336).
 */

/** A single metric sample at a point in time. */
export interface MetricReading {
  /** Metric identifier (e.g. `cpu.usage`). */
  metric: string;
  /** Observed numeric value. */
  value: number;
  /** Observation timestamp as Unix epoch milliseconds. */
  ts: number;
}

/** Comparison operator for threshold rules. */
export type ThresholdOp = '>' | '>=' | '<' | '<=';

/** Fires when a metric crosses a numeric threshold, optionally after a dwell period. */
export interface ThresholdRule {
  kind: 'threshold';
  id: string;
  metric: string;
  op: ThresholdOp;
  value: number;
  /** Minimum duration (ms) the condition must hold before transitioning to FIRING. */
  forMs?: number;
}

/** Fires when the metric changes by at least `delta` within `windowMs`. */
export interface RateOfChangeRule {
  kind: 'rateOfChange';
  id: string;
  metric: string;
  windowMs: number;
  delta: number;
}

/** Fires when no reading for the metric arrives within `withinMs`. */
export interface AbsenceRule {
  kind: 'absence';
  id: string;
  metric: string;
  withinMs: number;
}

/** Discriminated union of all supported rule kinds. Narrow on `kind` for exhaustive handling. */
export type Rule = ThresholdRule | RateOfChangeRule | AbsenceRule;

/** Lifecycle state of an alert for a single rule. */
export type AlertState = 'OK' | 'PENDING' | 'FIRING' | 'RESOLVED';

/**
 * A state transition emitted when a rule's alert state changes.
 *
 * `from` and `to` describe the transition; `at` is when the transition was recorded.
 */
export interface AlertEvent {
  ruleId: string;
  metric: string;
  from: AlertState;
  to: AlertState;
  at: number;
  /** Metric value associated with the transition, when applicable. */
  value?: number;
}

/** Point-in-time status of a single rule's alert. */
export interface AlertStatus {
  ruleId: string;
  state: AlertState;
  /** Epoch ms when the rule entered `state`. */
  since: number;
}
