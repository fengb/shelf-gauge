import { expect, factory } from 'test/support'
import { Suite } from 'lib/entity'
import { Serialize } from 'cerialize'

describe('serialization Suite', () => {
  it('does stuff', async () => {
    const suite: Suite = await factory.build(Suite)
    console.warn(Serialize(suite))
  })
})
