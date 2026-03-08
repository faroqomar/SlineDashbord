// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from 'eslint-plugin-storybook';
import { defineConfig, globalIgnores } from 'eslint/config';

let nextConfigs = [];
try {
  const [{ default: nextVitals }, { default: nextTs }] = await Promise.all([
    import('eslint-config-next/core-web-vitals'),
    import('eslint-config-next/typescript'),
  ]);
  nextConfigs = [...nextVitals, ...nextTs];
} catch {
  // This monorepo includes non-Next workspaces; allow lint to run without Next-specific config installed.
  nextConfigs = [];
}

export default defineConfig([
  ...nextConfigs,
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),
  ...storybook.configs['flat/recommended'],
]);
