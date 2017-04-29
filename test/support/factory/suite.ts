import { build, define, sequence, faker } from './helper'
import { Suite, SuiteEnv, SuiteTest } from 'lib/entity'

export default define(Suite, (suite) => ({
  id: sequence(),
  repositorySecret: null,
  ref: faker.random.uuid,
  name: faker.lorem.slug,
  createdAt: faker.date.recent,
  ranAt: () => suite.createdAt,
  env: () => build(SuiteEnv, { suite }),
  tests: () => [
    build(SuiteTest, { suite }),
    build(SuiteTest, { suite }),
  ],
}))
