interface ReifiedPromise<T, Error> extends Promise<T> {
  value?: T
  error?: Error
}

export function reify<T, Error> (promise: Promise<T>): ReifiedPromise<T, Error> {
  const reified:ReifiedPromise<T, Error> =
    promise.then((value) => {
      reified.value = value
      return value
    })
    .catch((err) => {
      reified.error = err
      throw err
    })

  return reified
}