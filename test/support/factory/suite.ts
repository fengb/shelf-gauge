import { build, define, sequence, faker } from './helper'
import { RepoSecret, Suite, SuiteEnv, SuiteTest, User } from 'lib/entity'

export default define(Suite, (suite: Suite) => ({
  repoSecret: () => build(RepoSecret),
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
