import { build, define, sequence, faker } from './helper'
import { Repo, RepoCommit } from 'src/entity'

export default define(RepoCommit, (entity) => ({
  repo: () => build(Repo, { commits: [entity] }),
  ref: faker.random.uuid,
  parent: faker.random.uuid,
}))
