import { build, define, sequence, faker } from './helper'
import { Suite, SuiteTest } from 'src/entity'

export default define(SuiteTest, (suiteTest) => ({
  suite: () => build(Suite, { tests: [suiteTest] }),
  name: faker.database.column,
  value: faker.random.number,
}))
