import { Context } from 'lib/server'
import { Repo } from 'lib/entity'
import repoSerializer from 'lib/serializer/repo'

import * as Suite from './suite'
export { Suite }

export async function show (ctx: Context) {
  const repo = await ctx.conn.entityManager.findOne(Repo, {
    source: ctx.params.source,
    name: ctx.params.name,
  })

  if (!repo) {
    return ctx.renderError('NotFound')
  }

  ctx.renderSuccess('Ok', repoSerializer.serialize(repo))
}
