import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // Use happy-dom in CI to avoid some jsdom/whatwg-url runtime issues
    environment: 'happy-dom',
    globals: true,
    setupFiles: './src/setupTests.ts'
  }
})
