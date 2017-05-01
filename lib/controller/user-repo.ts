import * as GithubApi from 'github'
import { Context, HttpStatus } from 'lib/server'

const github = new GithubApi()

export async function showAll (ctx: Context) {
  // TODO: why doesn't ctx.user work?
  console.log(ctx.authInfo)
  console.log(ctx.user)

  if (!ctx.state.user) {
    return ctx.redirect('/')
  }
  github.authenticate({ type: 'oauth', token: ctx.state.user.githubToken })
  ctx.body = await github.repos.getAll({ affiliation: 'owner' })
}
