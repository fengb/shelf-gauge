export interface Json {
  [key: string]: null | string | boolean | number | Json | Json[]
}

export type JsonField = null | string | boolean | number | Json | Json[]

interface Constructor<T> {
  new (): T
}

interface AtomParams<T> {
  only?: T[]
}

type ObjectTransform<T> = {
  [P in keyof T]?: Serializer<T[P]>
}

export interface Serializer<T> {
  serialize (value: T): JsonField
  deserialize (json: JsonField): T
}

export function string<T extends string>(params: AtomParams<T> = {}): Serializer<T> {
  return {
    serialize: String,
    deserialize: String as any,
  }
}

export function boolean<T extends boolean>(params: AtomParams<T> = {}): Serializer<T> {
  return {
    serialize: Boolean,
    deserialize: Boolean as any,
  }
}

export function number<T extends number>(params: AtomParams<T> = {}): Serializer<T> {
  return {
    serialize: Number,
    deserialize: Number as any,
  }
}

export function isoDateTime(): Serializer<Date> {
  return {
    serialize: (value) => value.toISOString(),
    deserialize: (json) => new Date(json as string),
  }
}

export function object<T>(constructor: Constructor<T>, transforms: ObjectTransform<T>): ObjectSerializer<T> {
  return new ObjectSerializer(constructor, transforms)
}

export function objectArray<T>(constructor: Constructor<T>, transforms: ObjectTransform<T>): Serializer<T[]> {
  const serializer = object(constructor, transforms)
  return {
    serialize (instances: T[]) {
      return serializer.serializeMany(instances)
    },

    deserialize (json: JsonField): T[] {
      return serializer.deserializeMany(json as Json[])
    }
  }
}

class ObjectSerializer<T> implements Serializer<T> {
  constructor (private type: Constructor<T>, private transforms: ObjectTransform<T>) {
  }

  serialize (instance: T): Json {
    const json = {} as Json
    for (const key in this.transforms) {
      const prop = instance[key]
      const transform = this.transforms[key]
      if (prop === undefined || transform == null) {
        continue
      }

      json[key] = transform.serialize(prop)
    }
    return json
  }

  serializeMany (instances: T[]): Json[] {
    return instances.map((instance) => this.serialize(instance))
  }

  deserialize (json: Json): T {
    const instance = new this.type()
    for (const key in this.transforms) {
      const field = json[key]
      const transform = this.transforms[key]
      if (field === undefined || transform == null) {
        continue
      }

      instance[key] = transform.deserialize(field)
    }
    return instance
  }

  deserializeMany (json: Json[]): T[] {
    return json.map((j) => this.deserialize(j))
  }
}
