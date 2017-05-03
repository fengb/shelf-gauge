import { build, define, sequence, faker } from './helper'
import { Repo, RepoSecret } from 'lib/entity'

export default define(RepoSecret, (entity) => ({
  id: null,
  repo: () => build(Repo, { secrets: [entity] }),
  key: faker.internet.ipv6,
  disabledAt: null,
}))
