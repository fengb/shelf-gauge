import chai from './chai'
import { assign, once } from 'lodash'

import chaiHttp = require('chai-http')
chai.use(chaiHttp)

import ENV from 'config/env'

import server from 'lib/server'

export { HttpStatus } from 'lib/server'

export const app = once(() => server.callback())

export class Request {
  constructor (public app: any) {}
}

export function request (): ChaiHttp.Agent {
  return chai.request.agent(app())
}

export async function authRequest (): Promise<ChaiHttp.Agent> {
  const agent = request()
  await agent.get(ENV.test!.auth.callback)
  return agent
}
