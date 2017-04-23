import { Context, HttpStatus } from 'lib/server'
import Repository from 'lib/entity/repository'

export async function create (ctx: Context) {
  const name = `${ctx.params.org}/${ctx.params.name}`
  const existing = await ctx.conn.entityManager.findOne(Repository, { name })
  if (existing) {
    ctx.status = HttpStatus.UnprocessableEntity
    return
  }

  const repo = new Repository({ name })
  await ctx.conn.entityManager.persist(repo)
  ctx.status = HttpStatus.Created
  ctx.body = repo
}
