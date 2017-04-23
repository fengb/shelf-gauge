import { Context, HttpStatus } from 'lib/server'
import Repository from 'lib/entity/repository'
import Suite from 'lib/entity/suite'

export async function all (ctx: Context) {
  const name = `${ctx.params.org}/${ctx.params.name}`
  const repo = await ctx.conn.entityManager.findOne(Repository, { name })
  if (!repo) {
    ctx.render(HttpStatus.NotFound)
  }

  ctx.render(HttpStatus.Ok, repo.suites)
}

export async function create (ctx: Context) {
  const name = `${ctx.params.org}/${ctx.params.name}`
  const repo = await ctx.conn.entityManager.findOne(Repository, { name })
  if (!repo) {
    ctx.render(HttpStatus.NotFound)
  }

  const suite = ctx.conn.entityManager.create(Suite, ctx.params)
  repo.suites.push(suite)
  await ctx.conn.entityManager.persist(repo)

  ctx.render(HttpStatus.Created, suite)
}
