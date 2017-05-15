interface Dict<T> {
  [key: string]: T
}

interface Resolver {
  (): Promise<Dict<any>>
  set (key: string, promise: PromiseLike<any>): void
}

export function resolver (): Resolver {
  const underlyings = {} as Dict<PromiseLike<any>>

  let resolved: undefined | Promise<Dict<any>>

  function resolve () {
    if (!resolved) {
      resolved = <any>Promise.props(underlyings)
    }
    return resolved
  }

  return Object.assign(resolve, {
    set (key: string, promise: PromiseLike<any>) {
      resolved = undefined
      underlyings[key] = promise
    }
  })
}
