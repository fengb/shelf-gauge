import { build, define, sequence, faker } from './helper'
import { Repository } from 'lib/entity'

export default define(Repository, () => ({
  id: sequence(),
  name: () => faker.internet.domainWord() + '/' + faker.internet.domainWord(),
  secrets: null,
  users: null,
}))
