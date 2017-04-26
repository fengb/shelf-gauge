import { expect } from 'test/support'
import * as iter from 'lib/util/iter'

describe('util/iter', () => {
  describe('needsMerge', () => {
    it('is true when different', () => {
      const target = {}
      const source = { key: 1 }
      expect(iter.needsAssign(target, source)).to.be.true
    })

    it('is false when the same', () => {
      const target = { key: 1 }
      const source = { key: 1 }
      expect(iter.needsAssign(target, source)).to.be.false
    })
  })
})
