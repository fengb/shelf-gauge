import 'reflect-metadata'
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

export const connect: Connect = once(() => createConnection(connect.options))
connect.options = {
  driver: {
    url: env.db.url,
    type: driverType(env.db.url),
  },
  logging: {
    logQueries: true,
    logSchemaCreation: true,
  },
  entities: Entities,
  autoSchemaSync: true,
}

export default async function (ctx: Context, next: () => Promise<any>) {
  ctx.conn = await connect()
  return next()
}
