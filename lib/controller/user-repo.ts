import { chain, some } from 'lodash'
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
  return Object.assign(new Repo(), {
    source: 'github',
    name: github.full_name.replace(/\//g, '~'),
    url: github.html_url,
  })
}

export async function githubShowAll (ctx: Context) {
  if (!ctx.state.user) {
    return ctx.redirect('/')
  }
  github.authenticate({ type: 'oauth', token: ctx.state.user.githubToken })
  const githubRepos = await github.repos.getAll({
    sort: "updated",
    per_page: 100
  }) as Success<GithubRepo[]>

  const repos = chain(githubRepos.data)
                .filter('permissions.admin')
                .map(asRepo)
                .value()

  ctx.renderSuccess('Ok', repoSerializer.serializeMany(repos))
}

export async function githubCreate (ctx: Context) {
  if (!ctx.state.user) {
    return ctx.redirect('/')
  }
  github.authenticate({ type: 'oauth', token: ctx.state.user.githubToken })
  const [owner, name] = ctx.params.name.split('~')
  const githubRepo = await github.repos.get({ owner, repo: name }) as GithubRepo

  if (!githubRepo || !githubRepo.permissions.admin) {
    return ctx.renderError('UnprocessableEntity')
  }

  const repo = asRepo(githubRepo)
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

  const secret = ctx.conn.entityManager.create(RepoSecret)
  secret.key = await secureRandom.base64(40)
  secret.repo = repo

  await ctx.conn.entityManager.persist(secret)

  ctx.renderSuccess('Created', { secret: secret.key })
}
