import { expect, factory } from 'test/support'
import { Suite, SuiteTest } from 'lib/entity'
import { Serialize } from 'cerialize'

describe('serialization Suite', () => {
  it('does stuff', async () => {
    const suite: Suite = await factory.build(Suite)
    suite.tests.push(await factory.build(SuiteTest))
    console.warn(Serialize(suite))
  })
})
