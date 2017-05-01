import { expect, request, db, factory, HttpStatus } from 'test/support'
import { Repository } from 'lib/entity'

describe('API /repo', () => {
  db.setup()

  describe('/:repoOrg/:repoName GET', () => {
    it('returns the repo data', async () => {
      const repo = factory.repository()
      const connection = await db.connect()
      await connection.entityManager.persist(repo)

      const response =
        await request()
              .get(`/repo/${repo.name}`)
              .send({})
      expect(response.status).to.equal(HttpStatus.Ok)
      expect(response.body).to.deep.equal({ name: repo.name })
    })
  })

  describe('/:repoOrg/:repoName/suite POST', () => {
    it('returns status created', async () => {
      const repo = factory.repository()
      const connection = await db.connect()
      await connection.entityManager.persist(repo)
    })
  })
})
