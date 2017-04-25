import 'reflect-metadata'
import { createConnection, Connection, ConnectionOptions } from 'typeorm'
import { once } from 'lodash'

import { Entities } from 'lib/entity'
import { Context } from '.'

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

export default async function (ctx: Context, next: () => Promise<any>) {
  ctx.conn = await connect()
  return next()
}
