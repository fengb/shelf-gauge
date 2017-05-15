import { expect } from 'test/support'
import * as promise from 'lib/util/promise'

describe('lib/util/promise', () => {
  describe('resolver()', () => {
    it('creates a fulfilled promise', async () => {
      const resolution = promise.resolver()
      expect(await resolution()).to.deep.equal({})
    })

    it('fulfills after a new pending promise becomes fulfilled', async () => {
      const deferred = Promise.defer()
      const resolution = promise.resolver()
      resolution.set('foo', deferred.promise)
      expect(resolution().isPending()).to.be.true

      deferred.resolve('bar')
      expect(await resolution()).to.deep.equal({ foo: 'bar' })
    })

    it('rejects after a new pending promise becomes rejected', async () => {
      const deferred = Promise.defer()
      const resolution = promise.resolver()
      resolution.set('foo', deferred.promise)
      expect(resolution().isPending()).to.be.true

      deferred.reject('bar')
      deferred.promise.catch(() => {})
      try {
        await resolution()
      } catch (err) {
        expect(err).to.equal('bar')
      }
    })
  })
})
