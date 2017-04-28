import * as GithubApi from 'github'
import { Context, HttpStatus } from 'lib/server'

const github = new GithubApi()

export async function showAll (ctx: Context) {
  // TODO: why doesn't ctx.user work?
  if (!ctx.state.user) {
    return
  }
  github.authenticate({ type: 'oauth', token: ctx.state.user.githubToken })
  ctx.body = await github.repos.getAll({ affiliation: 'owner' })
}
