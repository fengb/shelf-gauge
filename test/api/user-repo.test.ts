import { expect, sinon, authRequest, db, factory, stubApi, Http } from 'test/support'
import { Repo, RepoSecret, Suite, SuiteEnv, SuiteTest } from 'lib/entity'

describe('API /user/repo', () => {
  db.setup()

  describe('GET', () => {
    it('returns repo data from github', async function () {
      stubApi.github(this.sandbox)

      const agent = await authRequest()
      const response = await agent.get('/user/repo')

      expect(response.status).to.equal(Http.Success.Ok)
      expect(response.body).to.deep.equal({
        data: [
          { source: 'github', name: 'shelfgauge~shelfgauge', url: "https://github.com/shelfgauge/shelfgauge" }
        ]
      })
    })
  })

  describe('/:source/:name/secret POST', () => {
    it('rejects unaffiliated user', async function () {
      const agent = await authRequest()

      const repo = await factory.repo.create()

      const response = await agent.post(`/user/repo/${repo.source}/${repo.name}/secret`)

      expect(response.status).to.equal(Http.Error.NotFound)
    })

    it('returns a new secret', async function () {
      const agent = await authRequest()

      const repo = await factory.repo.create({ users: [agent.user] })

      const response = await agent.post(`/user/repo/${repo.source}/${repo.name}/secret`)

      expect(response.status).to.equal(Http.Success.Created)

      const secret = await this.conn!.entityManager.findOne(RepoSecret)
      expect(response.body.data).to.containSubset({ secret: secret!.key })
    })
  })
})
