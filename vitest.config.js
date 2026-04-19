import path from 'path'
import { loadEnv } from 'payload/node'
import { fileURLToPath } from 'url'
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default defineConfig(() => {
  loadEnv(path.resolve(dirname, './dev'))

  return {
    plugins: [
      tsconfigPaths({
        ignoreConfigErrors: true,
      }),
    ],
    test: {
      exclude: ['dev/e2e.spec.ts', 'tmp/**'],
      environment: 'node',
      hookTimeout: 30_000,
      include: ['dev/int.spec.ts'],
      testTimeout: 30_000,
    },
  }
})
