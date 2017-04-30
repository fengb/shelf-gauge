import { once, sample } from 'lodash'
import * as faker from 'faker'

export { faker }

export function randomize<T> (...values: T[]) {
  return () => sample(values)
}

export function sequence (val = 0) {
  return () => val++
}

type Constructor<T> = new () => T
type Factory<T> = (attrs?: Partial<T>) => T

type SimpleBuilder<T> = {
  [K in keyof T]: null | (() => T[K])
}

type ContextBuilder<T> = (instance: T) => SimpleBuilder<T>
type Builder<T> = SimpleBuilder<T> | ContextBuilder<T>

function scaffold<T> (attrs: Partial<T>, builder: Builder<T>): T {
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

const FACTORIES = new Map<Constructor<any>, Factory<any>>()

export function define<T> (constructor: Constructor<T>, builder: Builder<T>): Factory<T> {
  const factory = function (attrs: Partial<T> = {}): T {
    const obj = new constructor()
    const buildout = scaffold(attrs, builder)
    return Object.assign(obj, buildout)
  }

  FACTORIES.set(constructor, factory)

  return factory
}

export function build<T> (constructor: Constructor<T>, attrs: Partial<T> = {}): T {
  const factory = FACTORIES.get(constructor)
  if (!factory) {
    throw new Error(`factory '${constructor.name}' not defined`)
  }
  return factory(attrs)
}
