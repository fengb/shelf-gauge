import { Context, HttpStatus } from 'lib/server'
import { Repo } from 'lib/entity'
import Serializer from 'lib/util/serializer'

import * as Suite from './suite'
export { Suite }

const repoSerializer = new Serializer(Repo, {
  url: String,
  name: String,
})

export async function show (ctx: Context) {
  const name = ctx.params.name
  const repo = await ctx.conn.entityManager.findOne(Repo, { name })

  if (!repo) {
    return ctx.throw(HttpStatus.NotFound)
  }

  ctx.body = repoSerializer.serialize(repo)
}
