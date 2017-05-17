import { expect, sinon, authRequest, db, factory, stubService, HttpStatus } from 'test/support'
import { Repo, RepoCommit, RepoSecret, Suite, SuiteEnv, SuiteTest } from 'src/entity'

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

    it('generates commits', async function () {
      stubService.github(this.sandbox)

      const agent = await authRequest()
      const response = await agent.post('/user/repo/github')
                             .send({ name: 'shelfgauge~shelfgauge' })

      const commits = await this.conn!.entityManager.find(RepoCommit)
      expect(commits).to.containSubset([
        { "ref": "e81fe5082112520e9757132d03ab3c16fbfc612b", "parent": "d91c23a1500f8d9ddc8b6c900b44ec34e598acfd" },
        { "ref": "d91c23a1500f8d9ddc8b6c900b44ec34e598acfd", "parent": "39142589cfce622cdcbaf7079f3e6d9898d56d1c" },
      ])
    })
  })

  describe('/:source/:name/secret POST', () => {
    it('rejects unaffiliated user', async function () {
      const agent = await authRequest()

      const repo = await factory.repo.create()

      const response = await agent.post(`/user/repo/${repo.source}/${repo.name}/secret`)

      expect(response.status).to.equal(HttpStatus.Error.Forbidden)
    })

    it('returns a new secret', async function () {
      const agent = await authRequest()

      const repo = await factory.repo.create({ users: [agent.user] })

      const response = await agent.post(`/user/repo/${repo.source}/${repo.name}/secret`)

      expect(response.status).to.equal(HttpStatus.Success.Created)

      const secret = await this.conn!.entityManager.findOne(RepoSecret)
      expect(response.body.data).to.have.property('secret')
      expect(secret!.matches(response.body.data.secret)).to.be.true
    })
  })
})
