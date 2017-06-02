import { createConnection, Connection, ConnectionOptions } from 'typeorm'
import { DriverType } from 'typeorm/driver/DriverOptions'
import { once } from 'lodash'

import ENV from 'config/env'
import { Entities } from 'src/entity'
import { Context } from '.'

const TYPES: DriverType[] = ['mysql', 'postgres', 'mariadb', 'sqlite', 'oracle', 'mssql', 'websql']

function driverType (url: string): DriverType {
  for (const t of TYPES) {
    if (url.startsWith(t)) {
      return t
    }
  }

  throw new Error(`DB type cannot be found: ${url}`)
}

const OPTIONS: ConnectionOptions = {
  driver: {
    url: ENV.database.url,
    type: driverType(ENV.database.url),
  },
  logging: {
    logQueries: ENV.database.logging,
    logSchemaCreation: ENV.database.logging,
  },
  entities: Entities,
  autoSchemaSync: ENV.database.autoSync,
}

export { Connection }

export const connect = once(() => createConnection(OPTIONS))

declare module 'koa' {
  interface Context {
    conn: Connection
  }
}

export default async function (ctx: Context, next: () => Promise<any>) {
  ctx.conn = await connect()
  return next()
}
