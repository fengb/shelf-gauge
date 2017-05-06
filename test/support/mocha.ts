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

let BEFORE_ALL_CALLED = false

export function beforeAll (callback: HookCallback) {
  if (BEFORE_ALL_CALLED) {
    throw new Error('beforeAll() already triggered')
  }
  beforeAllCallbacks.push(callback)
}

let AFTER_ALL_CALLED = false

export function afterAll (callback: HookCallback) {
  if (AFTER_ALL_CALLED) {
    throw new Error('afterAll() already triggered')
  }
  afterAllCallbacks.push(callback)
}

const beforeAllCallbacks = [] as HookCallback[]
before(function () {
  BEFORE_ALL_CALLED = true
  return Promise.map(beforeAllCallbacks, (cb) => cb.call(this))
})

const afterAllCallbacks = [] as HookCallback[]
after(function () {
  AFTER_ALL_CALLED = true
  return Promise.map(afterAllCallbacks, (cb) => cb.call(this))
})

beforeEach(function () {
  this.sandbox = sinon.sandbox.create()
})
