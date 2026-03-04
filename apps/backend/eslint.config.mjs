import baseConfig from '@worklog-plus/config/eslint/base.js';

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...baseConfig,
  {
    ignores: ['dist/**', 'node_modules/**', 'prisma/**'],
  },
];
