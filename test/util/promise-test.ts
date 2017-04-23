import { expect } from 'test/support'
import * as promise from 'lib/util/promise'

describe('util/promise', () => {
  describe('reify()', () => {
    it('resolves correctly', async () => {
      const p = promise.reify(Promise.resolve(10))
      expect(await p).to.equal(10)
    })

    it('caches resolution into value', async () => {
      const p = promise.reify(Promise.resolve(15))
      await p
      expect(p.value).to.equal(15)
    })
  })
})
