import 'reflect-metadata'
import {createConnection, ConnectionOptions} from 'typeorm'

const OPTIONS: ConnectionOptions = {
  driver: {
    type: 'postgres',
    url: 'postgresql://dev@localhost:5432/shelf_gauge',
  },
  entities: [__dirname + '/../entity/*.ts'],
  autoSchemaSync: true
}

const CONNECTION = createConnection(OPTIONS)

export default async function (ctx, next) {
  ctx.connection = await CONNECTION
  await next()
}
