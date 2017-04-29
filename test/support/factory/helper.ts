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
  [K in keyof T]: null | (() => T[K])
}

type ContextBuilder<T> = (instance: T) => Builder<T>

function scaffold<T> (attrs: Partial<T>, builder: Builder<T> | ContextBuilder<T>): T {
  const cache = {} as T

  if (typeof builder === 'function') {
    builder = builder(cache)
  }

  for (const key in builder) {
    const build = builder[key]
    Object.defineProperty(cache, key, {
      enumerable: true,
      get: once(() => attrs[key] || build && build())
    })
  }

  return cache
}

export function define<T> (constructor: new () => T, builder: Builder<T> | ContextBuilder<T>) {
  return function (attrs: Partial<T> = {}): T {
    const obj = new constructor()
    const buildout = scaffold(attrs, builder)
    return Object.assign(obj, buildout)
  }
}
