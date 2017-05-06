import { Serialize } from 'cerialize'
import { expect, request, db, factory, HttpStatus } from 'test/support'
import { Repo, RepoSecret, Suite, SuiteEnv, SuiteTest } from 'lib/entity'

function asJson (obj: any): any {
  return JSON.parse(JSON.stringify(obj))
}

describe('API /repo', () => {
  db.setup()

  describe('/:repoOrg/:repoName GET', () => {
    it('returns the repo data', async function () {
      const repo = await factory.create(Repo)
      const response =
        await request()
              .get(`/repo/${repo.name}`)

      expect(response.status).to.equal(HttpStatus.Ok)
      expect(response.body).to.deep.equal({ url: repo.url, name: repo.name })
    })
  })

  describe('/:repoOrg/:repoName/suite POST', () => {
    const data = {
      ref: 'abc123',
      name: 'master',
      ranAt: new Date(),
      env: { source: 'travis', info: 'nooooooo' },
      tests: [
        { name: 'index', value: 13.5 },
        { name: 'haste', value: 0.125 },
      ]
    }

    it('returns 422 on failed', async function () {
      const secret = await factory.create(RepoSecret)

      const response =
        await request()
              .post(`/repo/${secret.repo.name}/suite`)
              .send(data)

      expect(response.status).to.equal(HttpStatus.UnprocessableEntity)
    })

    it('returns the suite data', async function () {
      const secret = await factory.create(RepoSecret)

      const response =
        await request()
              .post(`/repo/${secret.repo.name}/suite`)
              .send({...data, secret: secret.key})

      expect(response.status).to.equal(HttpStatus.Created)
      expect(response.body).to.containSubset(asJson(data))
    })

    it('saves the objects', async function () {
      const secret = await factory.create(RepoSecret)

      const response =
        await request()
              .post(`/repo/${secret.repo.name}/suite`)
              .send({...data, secret: secret.key})

      const conn = await db.connect()
      const suite = await conn.entityManager.findOne(Suite)
      expect(suite!).to.containSubset({
        ref: data.ref,
        name: data.name,
      })

      const env = await conn.entityManager.findOne(SuiteEnv)
      expect(env!).to.containSubset(data.env)

      const tests = await conn.entityManager.find(SuiteTest)
      expect(tests).to.containSubset(data.tests)
    })
  })
})
