import { expect, request, db, HttpStatus } from 'test/support'
import { Repository } from 'lib/entity'

describe('API /repo', () => {
  db.setup()

  describe('/:repoOrg/:repoName PUT', () => {
    it('returns status created', async () => {
      const response =
        await request()
              .put('/repo/foo/bar')
              .send({})
      expect(response).to.have.property('status', HttpStatus.Created)
    })

    it('creates a record', async () => {
      const response =
        await request()
              .put('/repo/foo/bar')
              .send({})

      const connection = await db.connect()
      const repos = await connection.entityManager.find(Repository)
      expect(repos).to.have.lengthOf(1)
      expect(repos[0]).to.containSubset({
        name: 'foo/bar'
      })
    })
  })
})
