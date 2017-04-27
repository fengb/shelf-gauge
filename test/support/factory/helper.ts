import * as faker from 'faker'

export { faker }

export function sequence (start = 0) {
  let val = start
  return () => val++
}

type Generators<T> = {
  [K in keyof T]: null | (() => T[K])
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
        obj[key] = generator()
      }
    }
    return obj
  }
}
