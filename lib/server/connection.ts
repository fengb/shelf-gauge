import 'reflect-metadata'
import { createConnection, ConnectionOptions } from 'typeorm'
import { reify } from 'lib/util/promise'

const OPTIONS: ConnectionOptions = {
  driver: {
    type: 'postgres',
    url: process.env.SHELF_GAUGE_DB,
  },
  entities: [__dirname + '/../entity/*.ts'],
  autoSchemaSync: true,
}

const CONNECTION = reify(createConnection(OPTIONS))

export default async function (ctx, next) {
  ctx.connection = CONNECTION.value || await CONNECTION
  await next()
}
