import { expect, db, factory } from 'test/support'
import RepoSecret from 'lib/entity/repo-secret'

describe('lib/entity/repo-secret', () => {
  describe('key=', () => {
    db.setup()

    it('is not saved', async function () {
      const secret = await factory.repoSecret.create()
      expect(secret.key).to.be.ok

      const fromDb = await this.conn!.entityManager.findOne(RepoSecret, { id: secret.id })
      expect(fromDb!.key).to.be.undefined
    })

    it('sets keyPrefix', function () {
      const secret = new RepoSecret({ key: 'foo' })
      expect(secret.key.startsWith(secret.keyPrefix)).to.be.true
    })

    describe('encryptedKey', function () {
      it('is different from key', async function () {
        const secret = new RepoSecret({ key: 'foo' })
        await secret.settled()
        expect(secret.encryptedKey).to.be.ok
        expect(secret.encryptedKey).not.to.equal(secret.key)
      })

      it('matches key', async function () {
        const secret = new RepoSecret({ key: 'foo' })
        await secret.settled()
        expect(await secret.matches(secret.key)).to.be.true
      })
    })
  })
})
