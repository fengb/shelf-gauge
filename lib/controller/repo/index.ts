import { Serialize } from 'cerialize'
import { Context, HttpStatus } from 'lib/server'
import { Repository } from 'lib/entity'

import * as Suite from './suite'
export { Suite }

export async function show (ctx: Context) {
  const name = `${ctx.params.org}/${ctx.params.name}`
  const repo = await ctx.conn.entityManager.findOne(Repository, { name })

  if (!repo) {
    return ctx.throw(HttpStatus.NotFound)
  }

  ctx.body = Serialize(repo)
}
