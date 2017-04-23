import { Context, HttpStatus } from 'lib/server'
import { Repository } from 'lib/entity'

export async function upsert (ctx: Context) {
  const name = `${ctx.params.org}/${ctx.params.name}`
  const repo = await ctx.conn.entityManager.findOne(Repository, { name })
               || ctx.conn.entityManager.create(Repository, { name })

  // TODO: update data
  const status = repo.id ? HttpStatus.Ok : HttpStatus.Created
  await ctx.conn.entityManager.persist(repo)

  ctx.renderJson(status, repo)
}
