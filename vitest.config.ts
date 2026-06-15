import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['test/**'],
    coverage: {
      provider: 'v8',
      reportsDirectory: 'coverage',
    },
  },
});
