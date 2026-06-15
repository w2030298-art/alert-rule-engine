import { describe, expect, it } from 'vitest';

import { createEngine } from '../src/core/index.js';
import type { MetricReading, Rule } from '../src/core/index.js';

describe('core contract', () => {
  const rules: Rule[] = [
    {
      kind: 'threshold',
      id: 'high-cpu',
      metric: 'cpu.usage',
      op: '>',
      value: 90,
      forMs: 60_000,
    },
    {
      kind: 'rateOfChange',
      id: 'temp-spike',
      metric: 'sensor.temp',
      windowMs: 300_000,
      delta: 5,
    },
    {
      kind: 'absence',
      id: 'heartbeat',
      metric: 'device.heartbeat',
      withinMs: 120_000,
    },
  ];

  it('createEngine returns a stub engine for valid rule shapes', () => {
    const result = createEngine(rules);
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    const reading: MetricReading = { metric: 'cpu.usage', value: 95, ts: Date.now() };
    expect(result.value.ingest(reading)).toEqual([]);
    expect(result.value.snapshot()).toEqual([]);
  });

  it('createEngine accepts an empty rule list', () => {
    const result = createEngine([]);
    expect(result.ok).toBe(true);
  });
});
