import { Context, HttpStatus } from 'lib/server'
import { Repository, Suite } from 'lib/entity'

export async function showAll (ctx: Context) {
  const name = `${ctx.params.org}/${ctx.params.name}`
  const repo = await ctx.conn.entityManager.findOne(Repository, { name })
  if (!repo) {
    ctx.renderJson(HttpStatus.NotFound)
  }

  ctx.renderJson(HttpStatus.Ok, repo.suites)
}

export async function create (ctx: Context) {
  const name = `${ctx.params.org}/${ctx.params.name}`
  const repo = await ctx.conn.entityManager.findOne(Repository, { name })
  if (!repo) {
    ctx.renderJson(HttpStatus.NotFound)
  }

  const suite = ctx.conn.entityManager.create(Suite, ctx.params)
  suite.repository = repo
  await ctx.conn.entityManager.persist(suite)

  ctx.renderJson(HttpStatus.Created, suite)
}
