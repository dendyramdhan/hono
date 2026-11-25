import { spawnSync } from 'node:child_process'
import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { createRequire } from 'node:module'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const compiler = createRequire(import.meta.url).resolve('typescript/bin/tsc')
const fixture = fileURLToPath(
  new URL('./fixtures/generic-json-declaration/tsconfig.json', import.meta.url)
)

describe('generic c.json() declaration emit', () => {
  it('writes a declaration for an exported generic function', { timeout: 60_000 }, () => {
    const outDir = mkdtempSync(join(tmpdir(), 'hono-generic-json-'))
    try {
      const result = spawnSync(
        process.execPath,
        [compiler, '--project', fixture, '--outDir', outDir],
        { encoding: 'utf8' }
      )
      // Since 4.13.19, JSONParsed's recursion goes through unexported aliases. For a
      // type parameter, tsc cannot name them and reports TS7056 instead of writing this file.
      expect(result.stdout + result.stderr).toBe('')
      expect(result.status).toBe(0)
      const dts = readFileSync(
        join(outDir, 'build/fixtures/generic-json-declaration/index.d.ts'),
        'utf8'
      )
      expect(dts).toContain('refused')
    } finally {
      rmSync(outDir, { recursive: true, force: true })
    }
  })
})
