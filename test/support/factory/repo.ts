import { build, define, randomize, sequence, faker } from './helper'
import { Repo } from 'src/entity'
import { RepoSource } from 'src/entity/repo'

export default define(Repo, () => ({
  url: faker.internet.url,
  source: randomize<RepoSource>('github', 'manual'),
  name: () => faker.internet.domainWord() + '~' + faker.internet.domainWord(),
}))
