import { Context, HttpStatus, passport } from 'lib/server'

const CALLBACK_REDIRECTS = {
  successRedirect: '/',
  failureRedirect: '/',
}

export async function signOut (ctx: Context) {
  ctx.logout()
  ctx.redirect('/')
}

export const githubShow = passport.authenticate('github')
export const githubCallback = passport.authenticate('github', CALLBACK_REDIRECTS)
