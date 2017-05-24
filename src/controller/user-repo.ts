import { chain, flatMap, some } from 'lodash'

import loadCommits from 'src/job/load-commits'
import * as github from 'src/service/github'
import repoSerializer from 'src/serializer/repo'
import { Context } from 'src/server'
import { Repo, RepoAuth } from 'src/entity'
import * as secureRandom from 'src/util/secure-random'

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
  const response = await github.fetchRepo(ctx.state.user.githubToken, ctx.request.body.name)

  if (!response.data.permissions.admin) {
    return ctx.renderError('UnprocessableEntity')
  }

  const repo = github.toRepo(response.data)
  repo.users = [ctx.state.user]

  await ctx.conn.entityManager.persist(repo)
  loadCommits(repo)

  ctx.renderSuccess('Created', repoSerializer.serialize(repo))
}

export async function createAuth (ctx: Context) {
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

  const auth = new RepoAuth({
    key: await secureRandom.base64(40),
    repo: repo,
  })

  await ctx.conn.entityManager.persist(auth)

  ctx.renderSuccess('Created', { authorization: auth.key })
}
