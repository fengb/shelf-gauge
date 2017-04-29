import { define, sequence, faker } from './helper'
import SuiteTest from 'lib/entity/suite-test'

export default define(SuiteTest, {
  id: sequence(),
  suite: null,
  name: () => faker.database.column(),
  value: () => faker.random.number(),
})
