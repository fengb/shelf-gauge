import * as Koa from 'koa'
import * as supertest from 'supertest'

import server from 'lib/server'

export { expect } from 'chai'
export { HttpStatus } from 'lib/server'

export function request (): supertest.SuperTest<supertest.Test> {
  return supertest(server.callback())
}
