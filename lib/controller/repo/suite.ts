import { Context } from 'lib/server'
import { Repo, RepoSecret, Suite, SuiteEnv, SuiteTest } from 'lib/entity'

import Serializer from 'lib/util/serializer'

const suiteSerializer = new Serializer(Suite, {
  ref: Serializer.String,
  name: Serializer.String,
  ranAt: Serializer.Date,
  createdAt: Serializer.Date,

  env: new Serializer(SuiteEnv, {
    source: <Serializer<any>>Serializer.String,
    info: Serializer.String,
  }),

  tests: new Serializer.Array(SuiteTest, {
    name: Serializer.String,
    value: Serializer.Number,
  })
})

export async function showAll (ctx: Context) {
  const name = ctx.params.name
  const repo = await ctx.conn.entityManager.findOne(Repo, { name })
  if (!repo) {
    return ctx.renderError('NotFound')
  }

  const suites = await ctx.conn.entityManager
                       .createQueryBuilder(Suite, 'suite')
                       .innerJoin(RepoSecret, 'secret')
                       .where('secret.repo=:repo', { repo: repo.id })
                       .getMany()

  ctx.renderSuccess('Ok', suiteSerializer.serializeMany(suites))
}

export async function create (ctx: Context) {
  const name = ctx.params.name
  const repo = await ctx.conn.entityManager.findOne(Repo, { name })
  if (!repo) {
    return ctx.renderError('NotFound')
  }

  const secret = await ctx.conn.entityManager.findOne(RepoSecret, {
    repo: repo.id,
    key: ctx.request.body.secret,
  })

  if (!secret) {
    return ctx.renderError('UnprocessableEntity')
  }

  const suite = suiteSerializer.deserialize(ctx.request.body.data)
  suite.createdAt = new Date()
  suite.repoSecret = secret
  await ctx.conn.entityManager.persist(suite)

  ctx.renderSuccess('Created', suiteSerializer.serialize(suite))
}
