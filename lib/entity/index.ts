import 'reflect-metadata'
import { createConnection, Connection, ConnectionOptions } from 'typeorm'
import { once } from 'lodash'

import Repository from './repository'
import Suite from './suite'

export { Repository, Suite }

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
  entities: [Repository, Suite],
  autoSchemaSync: true,
}
