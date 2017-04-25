import 'reflect-metadata'
import { createConnection, Connection, ConnectionOptions } from 'typeorm'
import { once } from 'lodash'

import Repository from './repository'
import Suite from './suite'
import SuiteMetum from './suite-metum'
import SuiteTest from './suite-test'

export { Repository, Suite, SuiteMetum, SuiteTest }
export const Entities: Function[] = [Repository, Suite, SuiteMetum, SuiteTest]

interface Connect {
  (): Promise<Connection>
  options?: ConnectionOptions
}

export const connect: Connect = once(() => createConnection(connect.options))
connect.options = {
  driver: {
    type: 'postgres',
    url: process.env.SHELF_GAUGE_DB,
  },
  entities: Entities,
  autoSchemaSync: true,
}
