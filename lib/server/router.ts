import * as Router from 'koa-router'
import controller from 'lib/controller'

export default
  new Router()
    .get('/repo/:org/:name/suite', controller.suite.all)
    .post('/repo/:org/:name/suite', controller.suite.create)