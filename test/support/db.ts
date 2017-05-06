import { once } from 'lodash'

import { connect } from 'lib/server/connection'
import { beforeAll, afterAll } from './mocha'

export { connect }

export function setup () {
  setupConn()
  setupTruncate()
  setupDisconnect()
}

export const setupConn = once(() => {
  beforeAll(async function () {
    this.conn = await connect()
    // await this.conn.syncSchema()
  })
})

export const setupDisconnect = once(() => {
  afterAll(async function () {
    const connection = await connect()
    await connection.close()
  })
})

export function setupTruncate () {
  afterEach(async function () {
    const conn = await connect()
    const names = conn.entityMetadatas.map((m) => `"${m.table.name}"`)
    return conn.entityManager.query(
      `TRUNCATE ${names.join(', ')} RESTART IDENTITY CASCADE`
    )
  })
}
