import { assign, once } from 'lodash'

import ENV from 'config/env'

import { User } from 'lib/entity'
import server from 'lib/server'

import { chai, db } from '.'

import * as HttpStatus from 'lib/util/http-status'
export { HttpStatus }

export const app = once(() => server.callback())

export function request (): ChaiHttp.Agent {
  return chai.request.agent(app())
}

interface AuthAgent extends ChaiHttp.Agent {
  user: User
}

export async function authRequest (): Promise<AuthAgent> {
  const agent = request() as AuthAgent
  await agent.get(ENV.test!.auth.callback)
  // TODO: get the real user
  const conn = await db.connect()
  agent.user = await conn.entityManager.findOne(User) as User
  return agent
}
