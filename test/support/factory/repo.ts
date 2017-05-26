import { build, define, randomize, sequence, faker } from './helper'
import { Repo } from 'src/entity'

export default define(Repo, () => ({
  url: faker.internet.url,
  source: randomize<Repo.Source>('github'),
  //source: randomize(...Repo.SOURCES),
  name: () => faker.internet.domainWord() + '~' + faker.internet.domainWord(),
}))
