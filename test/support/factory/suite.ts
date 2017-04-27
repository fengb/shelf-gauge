import { factory, sequence, faker } from './helper'
import Suite from 'lib/entity/suite'
import * as dependent from '.'

export default factory(Suite, {
  id: sequence(),
  repository: null,
  ref: () => faker.random.uuid(),
  name: () => faker.lorem.slug(),
  ranAt: () => faker.date.recent(),
  createdAt: () => faker.date.recent(),
  env: (suite: Suite) => dependent.suiteEnv({ suite }),
  tests: (suite: Suite) => [
    dependent.suiteTest({ suite }),
    dependent.suiteTest({ suite }),
  ],
})
