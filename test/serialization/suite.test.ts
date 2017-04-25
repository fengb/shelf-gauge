import { expect, factory } from 'test/support'
import { Suite, SuiteEnv, SuiteTest } from 'lib/entity'
import { Serialize } from 'cerialize'

describe('serialization Suite', () => {
  it('does stuff', async () => {
    const suite: Suite = await factory.build(Suite, {
      env: await factory.build(SuiteEnv)
    })
    suite.tests.push(await factory.build(SuiteTest))
    console.warn(Serialize(suite))
  })
})
