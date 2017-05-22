import { build, define, sequence, randomize, faker } from './helper'
import { Suite, SuiteEnv } from 'src/entity'

export default define(SuiteEnv, (env) => ({
  suite: () => build(Suite, { env }),
  source: randomize<SuiteEnv.Source>('travis', 'circle', 'misc'),
  info: faker.lorem.paragraph,
}))
