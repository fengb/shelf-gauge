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
    await Promise.map(connection.entityMetadatas, (metadata) => {
      const sql = `TRUNCATE "${metadata.table.name}" RESTART IDENTITY CASCADE`
      return connection.entityManager.query(sql)
    })
  })
}
