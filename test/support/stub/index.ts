import { sinon } from 'test/support'

import jobStub from './job'
import serviceStub from './service'

export function stub (sinon: sinon.SinonSandbox) {
  return {
    job: jobStub(sinon),
    service: serviceStub(sinon),
  }
}

// Hideous way to capture type structure
const _SANDBOX = sinon.sandbox.create()
const STUBS = stub(_SANDBOX)
_SANDBOX.restore()

export default STUBS

beforeEach(function () {
  this.sandbox = sinon.sandbox.create()
  Object.assign(STUBS, stub(this.sandbox))
})

afterEach(function () {
  this.sandbox.restore()
})
