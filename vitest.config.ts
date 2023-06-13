import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    deps: {
      interopDefault: false,
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
    },
  },
})
