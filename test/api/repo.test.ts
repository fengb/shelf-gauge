import { Serialize } from 'cerialize'
import { expect, request, db, factory, HttpStatus } from 'test/support'
import { Repository, RepositorySecret } from 'lib/entity'

describe('API /repo', () => {
  db.setup()

  describe('/:repoOrg/:repoName GET', () => {
    it('returns the repo data', async function () {
      const repo = await factory.create(Repository)
      const response =
        await request()
              .get(`/repo/${repo.name}`)
              .send({})

      expect(response.status).to.equal(HttpStatus.Ok)
      expect(response.body).to.deep.equal({ name: repo.name })
    })
  })

  describe.only('/:repoOrg/:repoName/suite POST', () => {
    xit('returns 422 on failed', async function () {
      const secret = await factory.create(RepositorySecret)

      const data = {
        ref: 'abc123',
        name: 'master',
        ranAt: new Date(),
      }
      const response =
        await request()
              .post(`/repo/${secret.repository.name}/suite`)
              .send(data)

      expect(response.status).to.equal(HttpStatus.UnprocessableEntity)
    })

    it('creates a suite', async function () {
      const secret = await factory.create(RepositorySecret)

      const data = {
        ref: 'abc123',
        name: 'master',
        ranAt: new Date(),
      }
      const response =
        await request()
              .post(`/repo/${secret.repository.name}/suite`)
              .send({...data, secret: secret.key})

      expect(response.status).to.equal(HttpStatus.Created)
      expect(response.body).to.containSubset(Serialize(data))
    })
  })
})
