import { build, define, sequence, faker } from './helper'
import { Suite, SuiteTest } from 'lib/entity'

export default define(SuiteTest, (suiteTest) => ({
  id: sequence(),
  suite: () => build(Suite, { tests: [suiteTest] }),
  name: faker.database.column,
  value: faker.random.number,
}))
