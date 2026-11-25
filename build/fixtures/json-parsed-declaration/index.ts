import type { Context } from '../../../src/context'

export const refused = <Reason extends string>(c: Context, reason: Reason) =>
  c.json({ reason }, 403)
