import { expect, sinon, authRequest, db, factory, stubApi, HttpStatus } from 'test/support'
import { Repo, RepoSecret, Suite, SuiteEnv, SuiteTest } from 'lib/entity'

describe('API /user/repo', () => {
  db.setup()

  describe('GET', () => {
    it('returns the repo data', async function () {
      stubApi.github(this.sandbox)

      const agent = await authRequest()
      const response = await agent.get('/user/repo')

      expect(response.status).to.equal(HttpStatus.Ok)
      expect(response.body).to.deep.equal([])
    })
  })
})
