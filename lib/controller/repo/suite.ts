import { Context, HttpStatus } from 'lib/server'
import { Repository, RepositorySecret, Suite } from 'lib/entity'

export async function showAll (ctx: Context) {
  const name = `${ctx.params.org}/${ctx.params.name}`
  const repo = await ctx.conn.entityManager.findOne(Repository, { name })
  if (!repo) {
    return ctx.throw(HttpStatus.NotFound)
  }

  const suites = await ctx.conn.entityManager
                       .createQueryBuilder(Suite, 'suite')
                       .innerJoin(RepositorySecret, 'secret')
                       .where('secret.repository=:repository', { repository: repo.id})

  ctx.body = suites
}

export async function create (ctx: Context) {
  const name = `${ctx.params.org}/${ctx.params.name}`
  const repo = await ctx.conn.entityManager.findOne(Repository, { name })
  if (!repo) {
    return ctx.throw(HttpStatus.NotFound)
  }

  const suite = ctx.conn.entityManager.create(Suite, ctx.params)
  // suite.repository = repo
  await ctx.conn.entityManager.persist(suite)

  ctx.status = HttpStatus.Created
  ctx.body = suite
}
