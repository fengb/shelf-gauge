import { Context, HttpStatus, Middleware, passport } from 'lib/server'
import { AuthenticateOptions } from 'passport'

const CALLBACK_REDIRECTS: AuthenticateOptions = {
  successRedirect: '/',
  failureRedirect: '/',
}

export async function signOut (ctx: Context) {
  ctx.logout()
  ctx.redirect('/')
}

export function oauthFor (strategy: string): Middleware {
  return passport.authenticate(strategy, CALLBACK_REDIRECTS)
}
