import * as sinon from 'sinon'
import { values } from 'lodash'

import { github } from 'lib/controller/user-repo'

const REPOS: { [key: string]: any } = {
  'octocat/Hello-World': require('./octocat--Hello-World.json'),
  'shelf-gauge/shelf-gauge': require('./shelf-gauge--shelf-gauge.json'),
}

export default function stub (sinon: { stub: sinon.SinonStubStatic }) {
  sinon.stub(github.repos, 'getAll')
       .returns(values(REPOS))
  sinon.stub(github.repos, 'get')
       .callsFake((owner: string, repo: string) => REPOS[`${owner}/${repo}`])
}
