import { find } from 'lodash'
import { Context } from 'src/server'
import { Repo, RepoAuth, Suite, SuiteEnv, SuiteTest } from 'src/entity'

import * as Serializer from 'src/util/serializer'

const suiteSerializer = Serializer.object(Suite, {
  ref: Serializer.string(),
  name: Serializer.string(),
  ranAt: Serializer.date(),
  createdAt: Serializer.date(),

  env: Serializer.object(SuiteEnv, {
    source: Serializer.string<SuiteEnv.Source>(),
    info: Serializer.string(),
  }),

  tests: Serializer.objectArray(SuiteTest, {
    name: Serializer.string(),
    value: Serializer.number(),
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
