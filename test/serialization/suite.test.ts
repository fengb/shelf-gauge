import { expect, factory } from 'test/support'
import { Suite, SuiteEnv, SuiteTest } from 'lib/entity'
import { Serialize } from 'cerialize'

describe('serialization Suite', () => {
  it('does stuff', () => {
    const suite: Suite = factory.build(Suite)
    console.warn(Serialize(suite))
  })
})
