/**
 * Alert rule engine — public contract surface.
 *
 * Only domain types and the engine factory are exported. Implementation helpers
 * (e.g. `assertNever`) remain internal to this package.
 */

export type { Result, RuleValidationError } from './errors.js';
export type { Engine } from './engine.js';
export { createEngine } from './engine.js';
export type {
  AbsenceRule,
  AlertEvent,
  AlertState,
  AlertStatus,
  MetricReading,
  RateOfChangeRule,
  Rule,
  ThresholdOp,
  ThresholdRule,
} from './types.js';
