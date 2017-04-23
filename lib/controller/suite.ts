import { Context, HttpStatus } from 'lib/server'
import Repository from 'lib/entity/repository'
import Suite from 'lib/entity/suite'

export async function all (ctx: Context) {
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
  repo.suites.push(suite)
  await ctx.conn.entityManager.persist(repo)

  ctx.renderJson(HttpStatus.Created, suite)
}
