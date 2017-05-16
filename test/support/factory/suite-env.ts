import { build, define, sequence, randomize, faker } from './helper'
import { Suite, SuiteEnv } from 'src/entity'
import { EnvSource } from 'src/entity/suite-env'

export default define(SuiteEnv, (env) => ({
  suite: () => build(Suite, { env }),
  source: randomize<EnvSource>('travis', 'circle', 'misc'),
  info: faker.lorem.paragraph,
}))
