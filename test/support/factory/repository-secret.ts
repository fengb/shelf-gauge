import { build, define, sequence, faker } from './helper'
import { Repository, RepositorySecret } from 'lib/entity'

export default define(RepositorySecret, (entity) => ({
  id: null,
  repository: () => build(Repository, { secrets: [entity] }),
  key: faker.internet.ipv6,
  disabledAt: null,
}))
