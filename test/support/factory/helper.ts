import { once, sample } from 'lodash'
import * as faker from 'faker'

export { faker }

export function randomize<T> (...values: T[]) {
  return () => sample(values)
}

export function sequence (val = 0) {
  return () => val++
}

type Builder<T> = {
  [K in keyof T]: null | ((instance?: T) => T[K])
}

function cachedBuilder<T> (attrs: Partial<T>, builder: Builder<T>): T {
  const cache = {} as T

  for (const key in builder) {
    const build = builder[key]
    Object.defineProperty(cache, key, {
      enumerable: true,
      get: once(() => attrs[key] || build && build(cache))
    })
  }

  return cache
}

export function factory<T> (constructor: new () => T, builder: Builder<T>) {
  return function (attrs: Partial<T> = {}): T {
    const obj = new constructor()
    const c = cachedBuilder(attrs, builder)
    return Object.assign(obj, c)
  }
}
