import { spawnSync } from 'node:child_process'
import { cpSync, mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const compiler = createRequire(import.meta.url).resolve('typescript/bin/tsc')
const fixture = fileURLToPath(new URL('./fixtures/json-parsed-declaration', import.meta.url))
const packageRoot = fileURLToPath(new URL('..', import.meta.url))

describe('JSONParsed declaration emit', () => {
  it(
    'emits a declaration for a generic function that returns c.json()',
    { timeout: 60_000 },
    () => {
      // The fixture must live outside this package so `hono` resolves through
      // the package exports, the same way a consumer's project does.
      const project = mkdtempSync(join(tmpdir(), 'hono-json-parsed-declaration-'))
      try {
        cpSync(fixture, project, { recursive: true })
        mkdirSync(join(project, 'node_modules'))
        symlinkSync(packageRoot, join(project, 'node_modules', 'hono'), 'dir')
        writeFileSync(join(project, 'package.json'), '{ "type": "module" }\n')

        const result = spawnSync(process.execPath, [compiler, '--project', project], {
          encoding: 'utf8',
        })
        expect(result.stdout + result.stderr).toBe('')
        expect(result.status).toBe(0)
      } finally {
        rmSync(project, { recursive: true, force: true })
      }
    }
  )
})
