import { createConnection, Connection, ConnectionOptions } from 'typeorm'
import { DriverType } from 'typeorm/driver/DriverOptions'
import { once } from 'lodash'

import env from 'config/env'
import { Entities } from 'lib/entity'
import { Context } from '.'

interface Connect {
  (): Promise<Connection>
  options?: ConnectionOptions
}

const TYPES: DriverType[] = ['mysql', 'postgres', 'mariadb', 'sqlite', 'oracle', 'mssql', 'websql']

function driverType (url: string): DriverType {
  for (const t of TYPES) {
    if (url.startsWith(t)) {
      return t
    }
  }

  throw new Error(`DB type cannot be found: ${url}`)
}

export { Connection }

export const connect: Connect = once(() => createConnection(connect.options))
connect.options = {
  driver: {
    url: env.db.url,
    type: driverType(env.db.url),
  },
  logging: {
    logQueries: env.db.logging,
    logSchemaCreation: env.db.logging,
  },
  entities: Entities,
  autoSchemaSync: true,
}

declare module 'koa' {
  interface Context {
    conn: Connection
  }
}

export default async function (ctx: Context, next: () => Promise<any>) {
  ctx.conn = await connect()
  return next()
}
