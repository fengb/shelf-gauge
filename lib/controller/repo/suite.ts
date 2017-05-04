import { Deserialize, Serialize } from 'cerialize'
import { Context, HttpStatus } from 'lib/server'
import { Repo, RepoSecret, Suite } from 'lib/entity'

export async function showAll (ctx: Context) {
  const name = `${ctx.params.org}/${ctx.params.name}`
  const repo = await ctx.conn.entityManager.findOne(Repo, { name })
  if (!repo) {
    return ctx.throw(HttpStatus.NotFound)
  }

  const suites = await ctx.conn.entityManager
                       .createQueryBuilder(Suite, 'suite')
                       .innerJoin(RepoSecret, 'secret')
                       .where('secret.repo=:repo', { repo: repo.id })

  ctx.body = suites
}

export async function create (ctx: Context) {
  const name = `${ctx.params.org}/${ctx.params.name}`
  const repo = await ctx.conn.entityManager.findOne(Repo, { name })
  if (!repo) {
    return ctx.throw(HttpStatus.NotFound)
  }

  const secretValue = ctx.request.body.secret
  if (!secretValue) {
    return ctx.throw(HttpStatus.UnprocessableEntity)
  }

  const secret = await ctx.conn.entityManager.findOne(RepoSecret, { repo: repo.id, key: secretValue })
  if (!secret) {
    return ctx.throw(HttpStatus.UnprocessableEntity)
  }

  const suite = Deserialize(ctx.request.body, Suite) as Suite
  suite.createdAt = new Date()
  suite.repoSecret = secret
  await ctx.conn.entityManager.persist(suite)

  ctx.status = HttpStatus.Created
  ctx.body = Serialize(suite)
}
