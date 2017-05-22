import { build, define, randomize, sequence, faker } from './helper'
import { Repo } from 'src/entity'

export default define(Repo, () => ({
  url: faker.internet.url,
  source: randomize<Repo.Source>('github', 'manual'),
  name: () => faker.internet.domainWord() + '~' + faker.internet.domainWord(),
}))
