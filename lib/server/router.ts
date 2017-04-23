import * as Router from 'koa-router'
import controller from 'lib/controller'

export default
  new Router()
    .put( '/repo/:org/:name',       controller.repository.create)
    .post('/repo/:org/:name',       controller.repository.create)

    .get( '/repo/:org/:name/suite', controller.suite.all)
    .post('/repo/:org/:name/suite', controller.suite.create)