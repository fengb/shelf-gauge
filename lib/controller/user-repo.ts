import { chain, some } from 'lodash'

import * as github from 'lib/service/github'
import repoSerializer from 'lib/serializer/repo'
import { Context } from 'lib/server'
import { Repo, RepoSecret } from 'lib/entity'
import * as secureRandom from 'lib/util/secure-random'

export async function githubShowAll (ctx: Context) {
  if (!ctx.state.user) {
    return ctx.redirect('/')
  }

  const githubRepos = await github.fetchRepos(ctx.state.user.githubToken)

  const repos = chain(githubRepos.data)
                .filter('permissions.admin')
                .map(github.toRepo)
                .value()

  ctx.renderSuccess('Ok', repoSerializer.serializeMany(repos))
}

export async function githubCreate (ctx: Context) {
  if (!ctx.state.user) {
    return ctx.redirect('/')
  }
  const githubRepo = await github.fetchRepo(ctx.state.user.githubToken, ctx.params.name)

  if (!githubRepo.data.permissions.admin) {
    return ctx.renderError('UnprocessableEntity')
  }

  const repo = github.toRepo(githubRepo.data)
  repo.users = [ctx.state.user]

  await ctx.conn.entityManager.persist(repo)

  ctx.renderSuccess('Ok', repoSerializer.serialize(repo))
}

export async function createSecret (ctx: Context) {
  if (!ctx.state.user) {
    return ctx.redirect('/')
  }

  const repo = await ctx.conn.entityManager
               .createQueryBuilder(Repo, 'repo')
               .leftJoinAndSelect('repo.users', 'user')
               .where('repo.source=:source AND repo.name=:name', {
                 source: ctx.params.source,
                 name: ctx.params.name,
               })
               .getOne()

  if (!repo) {
    return ctx.renderError('NotFound')
  }

  if (!some(repo.users, { id: ctx.state.user.id })) {
    return ctx.renderError('Forbidden')
  }

  const secret = new RepoSecret({
    key: await secureRandom.base64(40),
    repo: repo,
  })

  await ctx.conn.entityManager.persist(secret)

  ctx.renderSuccess('Created', { secret: secret.key })
}
