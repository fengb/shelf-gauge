import { connect, Connection } from 'lib/server/connection'
import { beforeAll, afterAll } from './mocha'

export { connect }

export function setup () {
  setupTruncate()
  setupDisconnect()
}

export function setupSchema () {
  beforeAll(async () => {
    const connection = await connect()
    await connection.syncSchema()
  })
}

export function setupDisconnect () {
  afterAll(async () => {
    const connection = await connect()
    await connection.close()
  })
}

export function setupTruncate () {
  beforeEach(async function () {
    const conn = await connect()
    const names = conn.entityMetadatas.map((m) => `"${m.table.name}"`)
    return conn.entityManager.query(
      `TRUNCATE ${names.join(', ')} RESTART IDENTITY CASCADE`
    )
  })
}
