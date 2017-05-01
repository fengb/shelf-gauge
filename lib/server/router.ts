import * as Router from 'koa-router'
import * as C from 'lib/controller'

export default
  new Router()
    .get( '/auth/github',           C.Auth.oauthFor('github'))

    .get( '/repo/:org/:name',       C.Repo.show)

    .get( '/repo/:org/:name/suite', C.Repo.Suite.showAll)
    .post('/repo/:org/:name/suite', C.Repo.Suite.create)

    .get('/user/repo',              C.UserRepo.showAll)
