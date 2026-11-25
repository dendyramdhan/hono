import type { Context } from '../../../src'

// `c.json()` returns `JSONParsed<T>`. For an unresolved type parameter, declaration
// emit has to name the aliases behind that type instead of inlining them (TS7056).
export const refused = <Reason extends string>(c: Context, reason: Reason) =>
  c.json({ reason }, 403)
