import { build as factoryBuild, Constructor } from './helper'
import { connect } from '../db'

export { default as repository } from './repository'
export { default as repositorySecret } from './repository-secret'
export { default as suite } from './suite'
export { default as suiteEnv } from './suite-env'
export { default as suiteTest } from './suite-test'

import { Entity } from 'lib/entity'

export function build<T> (constructor: Constructor<Entity & T>, attrs: Partial<T> = {}): T {
  return factoryBuild(constructor, attrs)
}

export async function create<T> (constructor: Constructor<Entity & T>, attrs: Partial<T> = {}): Promise<T> {
  const conn = await connect()
  const instance = build(constructor, attrs)
  await conn.entityManager.persist(instance)
  return instance
}
