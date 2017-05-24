import * as loadCommits from 'src/job/load-commits'

export default function stub (sinon: sinon.SinonSandbox) {
  return {
    loadCommits: sinon.stub(loadCommits, 'default'),
  }
}
