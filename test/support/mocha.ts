type Async<T> = () => Promise<T>

export function beforeAll (callback: Async<any>) {
  beforeAllCallbacks.push(callback)
}

export function afterAll (callback: Async<any>) {
  afterAllCallbacks.push(callback)
}

const beforeAllCallbacks = [] as Async<any>[]
before(() => Promise.map(beforeAllCallbacks, (cb) => cb()))

const afterAllCallbacks = [] as Async<any>[]
after(() => Promise.map(afterAllCallbacks, (cb) => cb()))
