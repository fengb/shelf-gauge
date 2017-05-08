import { once } from 'lodash'

export type Constructor<T> = new () => T
export type Factory<T> = (attrs?: Partial<T>) => T

export type Builder<T> = (instance: T) => {
  [K in keyof T]: null | (() => T[K])
}

function scaffold<T> (attrs: Partial<T>, builder: Builder<T>): T {
  const cache = {} as T

  const builderContext = builder(cache)

  for (const key in builderContext) {
    const build = builderContext[key]
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
