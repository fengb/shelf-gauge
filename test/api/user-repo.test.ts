import { expect, sinon, authRequest, db, factory, stubApi, HttpStatus } from 'test/support'
import { Repo, RepoSecret, Suite, SuiteEnv, SuiteTest } from 'lib/entity'

describe.only('API /user/repo', () => {
  db.setup()

  describe('GET', () => {
    let sandbox: sinon.SinonSandbox

    beforeEach(() => {
      sandbox = sinon.sandbox.create()
    })

    afterEach(() => {
      sandbox.restore()
    })

    it('returns the repo data', async function () {
      const repo = await factory.create(Repo)
      const agent = await authRequest()
      stubApi.github(sandbox)
      const response = await agent.get('/user/repo')

      expect(response.status).to.equal(HttpStatus.Ok)
      expect(response.body).to.deep.equal([])
    })
  })
})
