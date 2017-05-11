import { chain } from 'lodash'
import * as GithubApi from 'github'

import repoSerializer from 'lib/serializer/repo'
import { Context } from 'lib/server'
import { Repo, RepoSecret } from 'lib/entity'
import * as secureRandom from 'lib/util/secure-random'

export const github = new GithubApi()

interface Success<T> {
  data: T
}

interface GithubRepo {
  id: number
  name: string
  full_name: string
  description: string
  private: boolean
  fork: boolean
  url: string
  html_url: string

  permissions: {
    admin: boolean
    push: boolean
    pull: boolean
  }
}

function asRepo (github: GithubRepo): Repo {
  const repo = new Repo()
  repo.name = github.full_name
  repo.url = github.html_url
  return repo
}

export async function showAll (ctx: Context) {
  // TODO: why doesn't ctx.user work?
  console.log(ctx.authInfo)
  console.log(ctx.user)

  if (!ctx.state.user) {
    return ctx.redirect('/')
  }
  github.authenticate({ type: 'oauth', token: ctx.state.user.githubToken })
  const githubRepos = await github.repos.getAll({
    sort: "updated",
    per_page: 100
  }) as Success<GithubRepo[]>

  ctx.renderSuccess('Ok',
    chain(githubRepos.data)
    .filter('permissions.admin')
    .map((github) => repoSerializer.serialize(asRepo(github)))
    .value()
  )
}

export async function create (ctx: Context) {
  if (!ctx.state.user) {
    return ctx.redirect('/')
  }
  github.authenticate({ type: 'oauth', token: ctx.state.user.githubToken })
  const githubRepo = await github.repos.get({ owner: ctx.params.org, repo: ctx.params.name }) as GithubRepo

  if (!githubRepo || !githubRepo.permissions.admin) {
    return ctx.renderError('UnprocessableEntity')
  }

  const repo = ctx.conn.entityManager.create(Repo)

  repo.name = githubRepo.full_name
  repo.url = githubRepo.url
  repo.users = [ctx.state.user]

  await ctx.conn.entityManager.persist(repo)

  ctx.body = repo
}

export async function createSecret (ctx: Context) {
  if (!ctx.state.user) {
    return ctx.redirect('/')
  }

  const name = ctx.params.name
  const repo = await ctx.conn.entityManager
               .createQueryBuilder(Repo, 'repo')
               .innerJoin('repo.users', 'user')
               .getOne()

  if (!repo) {
    return ctx.renderError('NotFound')
  }

  const secret = ctx.conn.entityManager.create(RepoSecret)
  secret.key = await secureRandom.base64(40)
  secret.repo = repo

  await ctx.conn.entityManager.persist(secret)

  ctx.renderSuccess('Created', secret)
}
