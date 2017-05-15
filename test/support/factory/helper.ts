import { sample } from 'lodash'
import * as faker from 'faker'

import { Builder, Constructor, build, define as factoryDefine } from './factory'
import { connect } from '../db'

export { build, faker }

export function randomize<T> (...values: T[]) {
  return () => sample(values)
}

export function sequence (val = 0) {
  return () => val++
}

interface OptionalSettled {
  settled? (): Promise<any>
}

export function define<T extends OptionalSettled> (constructor: Constructor<T>, builder: Builder<T>) {
  const _build = factoryDefine(constructor, builder)

  function build (attrs: Partial<T> = {}): T {
    const instance = _build(attrs)
    if (instance.settled) {
      console.warn('Built a settleable object. Did you mean to use buildAsync?')
    }
    return instance
  }

  async function buildAsync (attrs: Partial<T> = {}): Promise<T> {
    const instance = _build(attrs)
    if (instance.settled) {
      await instance.settled()
    }
    return instance
  }

  async function create (attrs: Partial<T> = {}): Promise<T> {
    const [conn, instance] = await Promise.all([connect(), buildAsync(attrs)])
    await conn.entityManager.persist(instance)
    return instance
  }

  return { build, buildAsync, create }
}
