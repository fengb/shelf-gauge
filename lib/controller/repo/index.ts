import { Context } from 'lib/server'
import { Repo } from 'lib/entity'
import repoSerializer from 'lib/serializer/repo'

import * as Suite from './suite'
export { Suite }

export async function show (ctx: Context) {
  const name = ctx.params.name
  const repo = await ctx.conn.entityManager.findOne(Repo, { name })

  if (!repo) {
    return ctx.renderError('UnprocessableEntity')
  }

  ctx.renderSuccess('Ok', repoSerializer.serialize(repo))
}
