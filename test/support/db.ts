import { connect } from 'lib/server/connection'
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
  beforeEach(async () => {
    const connection = await connect()
    const names = connection.entityMetadatas.map((m) => `"${m.table.name}"`)
    return connection.entityManager.query(
      `TRUNCATE ${names.join(', ')} RESTART IDENTITY CASCADE`
    )
  })
}
