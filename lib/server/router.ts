import * as Router from 'koa-router'
import * as C from 'lib/controller'

import ENV from 'config/env'

const REPO_NAME = ':name([^/]+/[^/]+)'

const router =
  new Router()
    .get( '/auth/github',                   C.Auth.oauthFor('github'))

    .get( `/repo/${REPO_NAME}`,             C.Repo.show)

    .get( `/repo/${REPO_NAME}/suite`,       C.Repo.Suite.showAll)
    .post(`/repo/${REPO_NAME}/suite`,       C.Repo.Suite.create)

    .get( '/user/repo',                     C.UserRepo.showAll)
    .post(`/user/repo/${REPO_NAME}/secret`, C.UserRepo.createSecret)

if (ENV.test) {
  router.get(ENV.test.auth.callback, C.Auth.oauthFor('mock'))
}

export default router
