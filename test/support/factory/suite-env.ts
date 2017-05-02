import { build, define, sequence, randomize, faker } from './helper'
import { Suite, SuiteEnv } from 'lib/entity'
import { EnvSource } from 'lib/entity/suite-env'

export default define(SuiteEnv, (env) => ({
  id: null,
  suite: () => build(Suite, { env }),
  source: randomize<EnvSource>('travis', 'circle', 'misc'),
  info: faker.lorem.paragraph,
}))
