import { expect, sinon, authRequest, db, factory, stubApi, HttpStatus } from 'test/support'
import { Repo, RepoSecret, Suite, SuiteEnv, SuiteTest } from 'lib/entity'

describe('API /user/repo', () => {
  db.setup()

  describe('GET', () => {
    it('returns repo data from github', async function () {
      stubApi.github(this.sandbox)

      const agent = await authRequest()
      const response = await agent.get('/user/repo')

      expect(response.status).to.equal(HttpStatus.Ok)
      expect(response.body).to.deep.equal([])
    })
  })

  describe('/:repoOrg/:repoName/secret POST', () => {
    it('rejects unaffiliated user', async function () {
      const agent = await authRequest()

      const repo = await factory.create(Repo)

      const response = await agent.post(`/user/repo/${repo.name}/secret`)

      expect(response.status).to.equal(HttpStatus.NotFound)
    })

    it('returns a new secret', async function () {
      const agent = await authRequest()

      const repo = await factory.create(Repo, { users: [agent.user] })

      const response = await agent.post(`/user/repo/${repo.name}/secret`)

      expect(response.status).to.equal(HttpStatus.Created)

      const secret = await this.conn!.entityManager.findOne(RepoSecret)
      expect(response.body).to.containSubset({ key: secret!.key })
    })
  })
})
