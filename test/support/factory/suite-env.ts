import { factory, sequence, randomize, faker } from './helper'
import SuiteEnv, { EnvSource } from 'lib/entity/suite-env'

export default factory(SuiteEnv, {
  id: sequence(),
  suite: null,
  source: randomize<EnvSource>('travis', 'circle', 'misc'),
  info: () => faker.lorem.paragraph(),
})
