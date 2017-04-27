import { sample } from 'lodash'
import * as faker from 'faker'

export { faker }

export function randomize<T> (...values: T[]) {
  return () => sample(values)
}

export function sequence (val = 0) {
  return () => val++
}

type Generators<T> = {
  [K in keyof T]: null | ((instance?: T) => T[K])
}

export function factory<T> (constructor: new () => T, generators: Generators<T>) {
  return function (attrs: Partial<T> = {}): T {
    const obj = new constructor()
    Object.assign(attrs)

    for (const key in generators) {
      if (obj.hasOwnProperty(key)) {
        continue
      }

      const generator = generators[key]
      if (generator) {
        obj[key] = generator(obj)
      }
    }

    return obj
  }
}
