import { factory, sequence, faker } from './helper'
import SuiteTest from 'lib/entity/suite-test'

export default factory(SuiteTest, {
  id: sequence(),
  suite: null,
  name: () => faker.database.column(),
  value: () => faker.random.number(),
})
