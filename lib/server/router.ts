import * as Router from 'koa-router'
import * as Controller from 'lib/controller'

export default
  new Router()
    .put( '/repo/:org/:name',       Controller.Repository.upsert)
    .post('/repo/:org/:name',       Controller.Repository.upsert)

    .get( '/repo/:org/:name/suite', Controller.Suite.showAll)
    .post('/repo/:org/:name/suite', Controller.Suite.create)
