import { build, define, sequence, faker } from './helper'
import { Repository } from 'lib/entity'

export default define(Repository, () => ({
  id: sequence(),
  name: faker.database.column,
  secrets: null,
  users: null,
}))
