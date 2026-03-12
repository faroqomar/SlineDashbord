import { defineConfig } from 'vitest/config';

// Root config runs only node-based tests (api + shared). Storybook/browser tests
// run via: npm run test -w @sline/admin-ui (uses admin-ui's Vitest + addon there).
export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    projects: ['apps/api', 'packages/shared'],
  },
});