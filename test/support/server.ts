import chai from './chai'
import { once } from 'lodash'

import chaiHttp = require('chai-http')
chai.use(chaiHttp)

import server from 'lib/server'

export { HttpStatus } from 'lib/server'

export const app = once(() => server.callback())

export function request (): ChaiHttp.Agent {
  return chai.request(app())
}
