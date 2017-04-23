import 'reflect-metadata'
import { createConnection, ConnectionOptions } from 'typeorm'
import Context from './context'

const OPTIONS: ConnectionOptions = {
  driver: {
    type: 'postgres',
    url: process.env.SHELF_GAUGE_DB,
  },
  entities: [__dirname + '/../entity/*.ts'],
  autoSchemaSync: true,
}

const CONNECTION = createConnection(OPTIONS)

export default async function (ctx: Context, next) {
  ctx.conn = CONNECTION.isFulfilled() ? CONNECTION.value() : await CONNECTION
  return next()
}
