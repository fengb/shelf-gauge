import { expect, request, db, factory, HttpStatus } from 'test/support'
import { Repo, RepoSecret, Suite, SuiteEnv, SuiteTest } from 'lib/entity'

function asJson (obj: any): any {
  return JSON.parse(JSON.stringify(obj))
}

describe('API /repo', () => {
  db.setup()

  describe('/:source/:name GET', () => {
    it('returns the repo data', async function () {
      const repo = await factory.repo.create()
      const response =
        await request()
              .get(`/repo/${repo.source}/${repo.name}`)

      expect(response.status).to.equal(HttpStatus.Success.Ok)
      expect(response.body.data).to.deep.equal({ url: repo.url, source: repo.source, name: repo.name })
    })
  })

  describe('/:source/:name/suite POST', () => {
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
      const secret = await factory.repoSecret.create()

      const response =
        await request()
              .post(`/repo/${secret.repo.source}/${secret.repo.name}/suite`)
              .send({ data })

      expect(response.status).to.equal(HttpStatus.Error.UnprocessableEntity)
    })

    it('returns the suite data', async function () {
      const secret = await factory.repoSecret.create()

      const response =
        await request()
              .post(`/repo/${secret.repo.source}/${secret.repo.name}/suite`)
              .send({
                data,
                secret: secret.key,
              })

      expect(response.status).to.equal(HttpStatus.Success.Created)
      expect(response.body.data).to.containSubset(asJson(data))
    })

    it('saves the objects', async function () {
      const secret = await factory.repoSecret.create()

      const response =
        await request()
              .post(`/repo/${secret.repo.source}/${secret.repo.name}/suite`)
              .send({
                data,
                secret: secret.key,
              })

      const suite = await this.conn!.entityManager.findOne(Suite)
      expect(suite!).to.containSubset({
        ref: data.ref,
        name: data.name,
      })

      const env = await this.conn!.entityManager.findOne(SuiteEnv)
      expect(env!).to.containSubset(data.env)

      const tests = await this.conn!.entityManager.find(SuiteTest)
      expect(tests).to.containSubset(data.tests)
    })
  })
})
