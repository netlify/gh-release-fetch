const { overrides } = require('@netlify/eslint-config-node')

module.exports = {
  extends: '@netlify/eslint-config-node',
  parserOptions: {
    sourceType: 'module',
  },
  rules: {
    'func-style': ['error', 'declaration'],
    complexity: 'off',
    'import/extensions': ['error', 'ignorePackages'],
    'max-lines': 'off',
    'n/no-missing-import': 'off',
    'no-magic-numbers': 'off',
    'max-lines-per-function': 'off',
    // This rule enforces using Buffers with `JSON.parse()`. However, TypeScript
    // does not recognize yet that `JSON.parse()` accepts Buffers as argument.
    'unicorn/prefer-json-parse-buffer': 'off',
  },
  overrides: [
    ...overrides,
    {
      files: '*.ts',
      rules: {
        // Pure ES modules with TypeScript require using `.js` instead of `.ts`
        // in imports
        'import/extensions': 'off',
        'import/no-namespace': 'off',
        // https://github.com/typescript-eslint/typescript-eslint/issues/2483
        'max-lines': 'off',
        'max-statements': 'off',
        'no-shadow': 'off',
        '@typescript-eslint/no-shadow': 'error',
      },
    },
  ],
}
