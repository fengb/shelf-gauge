import { expect, sinon, authRequest, db, factory, stubService, HttpStatus } from 'test/support'
import { Repo, RepoCommit, RepoAuth, Suite, SuiteEnv, SuiteTest } from 'src/entity'
import * as loadCommits from 'src/job/load-commits'

describe('API /user/repo', () => {
  db.setup()

  describe('/github GET', () => {
    it('returns repo data from github', async function () {
      stubService.github(this.sandbox)

      const agent = await authRequest()
      const response = await agent.get('/user/repo/github')

      expect(response.status).to.equal(HttpStatus.Success.Ok)
      expect(response.body.data).to.deep.equal([
        { source: 'github', name: 'shelfgauge~shelfgauge', url: "https://github.com/shelfgauge/shelfgauge" }
      ])
    })
  })

  describe('/github POST', () => {
    it('creates a new repo', async function () {
      stubService.github(this.sandbox)

      const agent = await authRequest()
      const response = await agent.post('/user/repo/github')
                             .send({ name: 'shelfgauge~shelfgauge' })

      expect(response.status).to.equal(HttpStatus.Success.Created)
      expect(response.body.data).to.deep.equal({
        source: 'github', name: 'shelfgauge~shelfgauge', url: "https://github.com/shelfgauge/shelfgauge"
      })
    })

    it('loads commits', async function () {
      stubService.github(this.sandbox)
      const spy = this.sandbox.spy(loadCommits, "fromGithub")

      const agent = await authRequest()
      const response = await agent.post('/user/repo/github')
                             .send({ name: 'shelfgauge~shelfgauge' })

      expect(spy).to.have.been.calledWithMatch({ name: 'shelfgauge~shelfgauge' })
    })
  })

  describe('/:source/:name/auth POST', () => {
    it('rejects unaffiliated user', async function () {
      const agent = await authRequest()

      const repo = await factory.repo.create()

      const response = await agent.post(`/user/repo/${repo.source}/${repo.name}/auth`)

      expect(response.status).to.equal(HttpStatus.Error.Forbidden)
    })

    it('returns a new auth', async function () {
      const agent = await authRequest()

      const repo = await factory.repo.create({ users: [agent.user] })

      const response = await agent.post(`/user/repo/${repo.source}/${repo.name}/auth`)

      expect(response.status).to.equal(HttpStatus.Success.Created)

      const auth = await this.conn!.entityManager.findOne(RepoAuth)
      expect(response.body.data).to.have.property('authorization')
      expect(auth!.matches(response.body.data.authorization)).to.be.true
    })
  })
})
