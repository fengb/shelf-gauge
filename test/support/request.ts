import * as supertest from 'supertest'
import { once } from 'lodash'

import server from 'lib/server'

export const app = once(() => server.callback())

export default function request (): supertest.SuperTest<supertest.Test> {
  return supertest(app())
}
