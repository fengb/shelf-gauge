import * as sinon from 'sinon'
import { values } from 'lodash'

import { API } from 'src/service/github'

const REPOS: { [key: string]: any } = {
  'octocat/Hello-World': require('./octocat~Hello-World.json'),
  'shelfgauge/shelfgauge': require('./shelfgauge~shelfgauge.json'),
}

export default function stub (sinon: { stub: sinon.SinonStubStatic }) {
  sinon.stub(API.repos, 'getAll')
    .returns(Promise.resolve({ data: values(REPOS) }))

  sinon.stub(API.repos, 'get')
    .callsFake(({ owner, repo }) => ({
      data: REPOS[`${owner}/${repo}`]
    }))
}
