import { build, define, sequence, faker } from './helper'
import { RepoAuth, Suite, SuiteEnv, SuiteTest, User } from 'src/entity'

export default define(Suite, (suite: Suite) => ({
  repoAuth: () => build(RepoAuth),
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
