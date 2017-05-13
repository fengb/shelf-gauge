import { build, define, randomize, sequence, faker } from './helper'
import { Repo } from 'lib/entity'
import { RepoSource } from 'lib/entity/repo'

export default define(Repo, () => ({
  url: faker.internet.url,
  source: randomize<RepoSource>('github', 'manual'),
  name: () => faker.internet.domainWord() + '~' + faker.internet.domainWord(),
}))
