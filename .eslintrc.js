module.exports = {
  extends: '@netlify/eslint-config-node',
  rules: {
    'node/no-unsupported-features/es-syntax': [
      'error',
      {
        ignores: ['modules'],
      },
    ],
    'func-style': ['error', 'declaration'],
  },
}
