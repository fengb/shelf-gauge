import * as typeorm from 'typeorm'
import * as sinon from 'sinon'

declare module 'mocha' {
  interface MochaExtensions {
    conn?: typeorm.Connection
    sandbox: sinon.SinonSandbox
  }

  interface IHookCallbackContext extends MochaExtensions {}
  interface ITestCallbackContext extends MochaExtensions {}
}

type HookCallback = (this: Mocha.IHookCallbackContext) => Promise<any>

export function beforeAll (callback: HookCallback) {
  beforeAllCallbacks.push(callback)
}

export function afterAll (callback: HookCallback) {
  afterAllCallbacks.push(callback)
}

const beforeAllCallbacks = [] as HookCallback[]
before(function () {
  return Promise.map(beforeAllCallbacks, (cb) => cb.call(this))
})

const afterAllCallbacks = [] as HookCallback[]
after(function () {
  return Promise.map(afterAllCallbacks, (cb) => cb.call(this))
})

beforeEach(function () {
  this.sandbox = sinon.sandbox.create()
})
