import { connect, Entities } from 'lib/entity'

export function setup () {
  setupTruncate()
}

export function setupTruncate () {
  beforeEach(async () => {
    const connection = await connect()
    await Promise.map(connection.entityMetadatas, (metadata) => {
      const sql = `TRUNCATE ${metadata.table.name} RESTART IDENTITY CASCADE`
      return connection.entityManager.query(sql)
    })
  })
}
