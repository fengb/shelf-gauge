import { filter } from 'lodash'
import * as GithubApi from 'github'
import { Context, HttpStatus } from 'lib/server'
import { Repo } from 'lib/entity'

export const github = new GithubApi()

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

export async function showAll (ctx: Context) {
  // TODO: why doesn't ctx.user work?
  console.log(ctx.authInfo)
  console.log(ctx.user)

  if (!ctx.state.user) {
    return ctx.redirect('/')
  }
  github.authenticate({ type: 'oauth', token: ctx.state.user.githubToken })
  const githubRepos = await github.repos.getAll({}) as GithubRepo[]

  ctx.body = filter(githubRepos, 'permissions.admin')
}

export async function create (ctx: Context) {
  if (!ctx.state.user) {
    return ctx.redirect('/')
  }
  github.authenticate({ type: 'oauth', token: ctx.state.user.githubToken })
  const githubRepo = await github.repos.get({ owner: ctx.params.org, repo: ctx.params.name }) as GithubRepo

  if (!githubRepo || !githubRepo.permissions.admin) {
    return ctx.throw(HttpStatus.UnprocessableEntity)
  }

  const repo = ctx.conn.entityManager.create(Repo)

  repo.name = githubRepo.full_name
  repo.url = githubRepo.url
  repo.users = [ctx.state.user]

  await ctx.conn.entityManager.persist(repo)

  ctx.body = repo
}
