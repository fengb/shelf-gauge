import * as Router from 'koa-router'
import * as C from 'src/controller'

import ENV from 'config/env'

const router =
  new Router()
    .get( '/auth/github',                    C.Auth.oauthFor('github'))

    .get( '/repo/:source/:name',             C.Repo.show)

    .get( '/repo/:source/:name/suite',       C.Repo.Suite.showAll)
    .post('/repo/:source/:name/suite',       C.Repo.Suite.create)

    .get( '/user/repo/github',               C.UserRepo.githubShowAll)
    .post('/user/repo/github',               C.UserRepo.githubCreate)
    .post('/user/repo/:source/:name/auth',   C.UserRepo.createAuth)

if (ENV.test) {
  router.get(ENV.test.auth.callback, C.Auth.oauthFor('mock'))
}

export default router
