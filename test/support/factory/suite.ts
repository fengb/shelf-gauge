import { Suite } from 'lib/entity'
import { factory, sequence, faker } from './helper'

export default factory(Suite, {
  id: sequence(),
  repository: null,
  ref: faker.random.uuid,
  name: faker.lorem.slug,
  ranAt: faker.date.recent,
  createdAt: faker.date.recent,
  env: null,
  tests: () => [],
})
