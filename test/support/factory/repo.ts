import { build, define, sequence, faker } from './helper'
import { Repo } from 'lib/entity'

export default define(Repo, () => ({
  id: null,
  url: faker.internet.url,
  name: () => faker.internet.domainWord() + '~' + faker.internet.domainWord(),
  secrets: null,
  users: null,
}))
