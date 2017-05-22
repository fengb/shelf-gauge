import { find } from 'lodash'
import { Context } from 'src/server'
import { Repo, RepoAuth, Suite, SuiteEnv, SuiteTest } from 'src/entity'

import Serializer from 'src/util/serializer'

const suiteSerializer = new Serializer(Suite, {
  ref: Serializer.String,
  name: Serializer.String,
  ranAt: Serializer.Date,
  createdAt: Serializer.Date,

  env: new Serializer(SuiteEnv, {
    source: Serializer.String as Serializer<SuiteEnv.Source>,
    info: Serializer.String,
  }),

  tests: new Serializer.Array(SuiteTest, {
    name: Serializer.String,
    value: Serializer.Number,
  })
})

export async function showAll (ctx: Context) {
  const repo = await ctx.conn.entityManager.findOne(Repo, {
    source: ctx.params.source,
    name: ctx.params.name,
  })

  if (!repo) {
    return ctx.renderError('NotFound')
  }

  const suites = await ctx.conn.entityManager
                       .createQueryBuilder(Suite, 'suite')
                       .innerJoin(RepoAuth, 'auth')
                       .where('auth.repo=:repo', { repo: repo.id })
                       .getMany()

  ctx.renderSuccess('Ok', suiteSerializer.serializeMany(suites))
}

export async function create (ctx: Context) {
  const repo = await ctx.conn.entityManager
               .createQueryBuilder(Repo, 'repo')
               .leftJoinAndSelect('repo.auths', 'auth')
               .where('repo.source=:source AND repo.name=:name', {
                 source: ctx.params.source,
                 name: ctx.params.name,
               })
               .getOne()

  if (!repo) {
    return ctx.renderError('NotFound')
  }

  const requestAuth = String(ctx.request.body.authorization)
  const auth = find(repo.auths, (auth) => auth.matches(requestAuth))

  if (!auth) {
    return ctx.renderError('Forbidden')
  }

  const suite = suiteSerializer.deserialize(ctx.request.body.data)
  suite.createdAt = new Date()
  suite.repoAuth = auth
  await ctx.conn.entityManager.persist(suite)

  ctx.renderSuccess('Created', suiteSerializer.serialize(suite))
}
