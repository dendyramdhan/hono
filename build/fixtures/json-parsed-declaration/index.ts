import type { Context } from 'hono'

// `Reason` is still a type parameter when `c.json()` is inferred. Declaration emit
// must name the JSONParsed helpers instead of expanding them until TS7056.
export const refused = <Reason extends string>(c: Context, reason: Reason) =>
  c.json({ reason }, 403)
