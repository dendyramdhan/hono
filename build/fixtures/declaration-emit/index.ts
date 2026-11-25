import { Hono } from 'hono'
import type { Context } from 'hono'
import { createFactory } from 'hono/factory'
import { testClient } from 'hono/testing'

// Inferred types like these mention internal aliases from hono's declarations
// (for example the return type of `c.json()`). Consumers that build with
// `declaration: true` must be able to emit them without naming those aliases.
export const handlers = createFactory().createHandlers((c) => c.json({ ok: true }))

export const app = new Hono().get('/', (c) => c.json({ ok: true }))
export type AppType = typeof app

// `testClient()` returns a client whose members are `ClientRequest` from `hono/client`.
// It must stay nameable even though this file never imports `hono/client`.
export const client = testClient(app)

// An unresolved type parameter cannot be reduced to a concrete JSON type, so emit has to
// name `JSONParsedInner` / `JSONParsedStep`. Those aliases must be exported or tsc reports TS7056.
export const refused = <Reason extends string>(c: Context, reason: Reason) =>
  c.json({ reason }, 403)
