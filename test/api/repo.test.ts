import { Serialize } from 'cerialize'
import { expect, request, db, factory, HttpStatus } from 'test/support'
import { Repository } from 'lib/entity'

describe('API /repo', () => {
  db.setup()

  beforeEach(async function () {
    this.repo = factory.repository()
    const connection = await db.connect()
    await connection.entityManager.persist(this.repo)
  })

  describe('/:repoOrg/:repoName GET', () => {
    it('returns the repo data', async function () {
      const response =
        await request()
              .get(`/repo/${this.repo.name}`)
              .send({})

      expect(response.status).to.equal(HttpStatus.Ok)
      expect(response.body).to.deep.equal({ name: this.repo.name })
    })
  })

  describe('/:repoOrg/:repoName/suite POST', () => {
    it('creates a suite', async function () {
      const data = {
        ref: 'abc123',
        name: 'master',
        ranAt: new Date(),
      }
      const response =
        await request()
              .post(`/repo/${this.repo.name}/suite`)
              .send(data)

      expect(response.status).to.equal(HttpStatus.Created)
      expect(response.body).to.containSubset(Serialize(data))
    })
  })
})
