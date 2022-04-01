module.exports = {
  extends: '@netlify/eslint-config-node',
  rules: {
    'n/no-unsupported-features/es-syntax': [
      'error',
      {
        ignores: ['modules'],
      },
    ],
    'func-style': ['error', 'declaration'],
  },
}
