import { Context, HttpStatus } from 'lib/server'
import { Repo, RepoSecret, Suite, SuiteEnv, SuiteTest } from 'lib/entity'

import Serializer from 'lib/util/serializer'

const suiteSerializer = new Serializer(Suite, {
  ref: String,
  name: String,
  ranAt: Date,
  createdAt: Date,

  env: new Serializer(SuiteEnv, {
    source: String,
    info: String,
  }),

  tests: new Serializer.Array(SuiteTest, {
    name: String,
    value: Number,
  })
})

export async function showAll (ctx: Context) {
  const name = ctx.params.name
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
  const name = ctx.params.name
  const repo = await ctx.conn.entityManager.findOne(Repo, { name })
  if (!repo) {
    return ctx.throw(HttpStatus.NotFound)
  }

  const secret = await ctx.conn.entityManager.findOne(RepoSecret, {
    repo: repo.id,
    key: ctx.request.body.secret,
  })

  if (!secret) {
    return ctx.throw(HttpStatus.UnprocessableEntity)
  }

  const suite = suiteSerializer.deserialize(ctx.request.body)
  suite.createdAt = new Date()
  suite.repoSecret = secret
  await ctx.conn.entityManager.persist(suite)

  ctx.status = HttpStatus.Created
  ctx.body = suiteSerializer.serialize(suite)
}
