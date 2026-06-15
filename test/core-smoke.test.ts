import { describe, expect, it } from 'vitest';

import { corePlaceholder } from '../src/core/index.js';

describe('core placeholder', () => {
  it('exports a smoke-testable value', () => {
    expect(corePlaceholder).toBe('alert-rule-engine-core');
  });
});
