import * as Koa from 'koa'
import * as supertest from 'supertest'
import { once } from 'lodash'

import server from 'lib/server'

const app = once(() => server.callback())

export { expect } from 'chai'
export { HttpStatus } from 'lib/server'

export function request (): supertest.SuperTest<supertest.Test> {
  return supertest(app())
}
