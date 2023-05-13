import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    deps: {
      interopDefault: false,
    },
    coverage: {
      provider: 'c8',
      reporter: ['text', 'lcov'],
    },
  },
})
