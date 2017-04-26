import * as Router from 'koa-router'
import * as C from 'lib/controller'

export default
  new Router()
    .get( '/auth/github',           C.Auth.oauthFor('github'))

    .put( '/repo/:org/:name',       C.Repository.upsert)
    .post('/repo/:org/:name',       C.Repository.upsert)

    .get( '/repo/:org/:name/suite', C.Suite.showAll)
    .post('/repo/:org/:name/suite', C.Suite.create)
