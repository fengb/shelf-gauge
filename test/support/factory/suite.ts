import { define, sequence, faker } from './helper'
import Suite from 'lib/entity/suite'
import * as factory from '.'

export default define(Suite, (suite) => ({
  id: sequence(),
  repositorySecret: null,
  ref: () => faker.random.uuid(),
  name: () => faker.lorem.slug(),
  ranAt: () => suite.createdAt,
  createdAt: () => faker.date.recent(),
  env: () => factory.suiteEnv({ suite }),
  tests: () => [
    factory.suiteTest({ suite }),
    factory.suiteTest({ suite }),
  ],
}))
