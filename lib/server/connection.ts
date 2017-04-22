import 'reflect-metadata'
import {createConnection, ConnectionOptions} from 'typeorm'

const OPTIONS: ConnectionOptions = {
  driver: {
    type: 'postgres',
    url: process.env.SHELF_GAUGE_DB,
  },
  entities: [__dirname + '/../entity/*.ts'],
  autoSchemaSync: true,
}

const CONNECTION = createConnection(OPTIONS)

export default async function (ctx, next) {
  ctx.connection = await CONNECTION
  await next()
}
