interface Json {
  [key: string]: null | string | boolean | number | Array<Json> | Json
}

type JsonField = null | string | boolean | number | Array<Json> | Json

type Constructor<T> = {
  new (): T
}

type Transform = StringConstructor | BooleanConstructor | NumberConstructor | DateConstructor

interface ISerializer<T> {
  serialize (instance: T): JsonField
  deserialize (json: JsonField): T
}

function isSerializer(obj: any): obj is ISerializer<any>{
  return typeof obj.serialize === 'function' && typeof obj.deserialize === 'function'
}

class ArraySerializer<T> implements ISerializer<Array<T>> {
  private serializer: Serializer<T>

  constructor (type: Constructor<T>, transforms: { [P in keyof T]?: Transform | ISerializer<T[P]> }) {
    this.serializer = new Serializer(type, transforms)
  }

  serialize(instances: Array<T>): JsonField {
    return instances.map((inst) => this.serializer.serialize(inst))
  }

  deserialize(json: JsonField): Array<T> {
    return (json as Array<JsonField>).map((field) => this.serializer.deserialize(field as any))
  }
}

class Serializer<T> implements ISerializer<T> {
  static Array = ArraySerializer

  constructor (private type: Constructor<T>, private transforms: { [P in keyof T]?: Transform | ISerializer<T[P]> }) {
  }

  serialize (instance: T): Json {
    const json = {} as Json
    for (const key in this.transforms) {
      const field = instance[key]
      const transform = this.transforms[key]
      if (field === undefined || transform == null) {
        continue
      }

      json[key] = this.serializeField(field, transform)
    }
    return json
  }

  serializeField (field: any, transform: Transform | ISerializer<any>): JsonField {
    if (field == null) {
      return null
    }
    if (isSerializer(transform)) {
      return transform.serialize(field)
    }
    if (transform === String) {
      return String(field)
    }
    if (transform === Boolean) {
      return Boolean(field)
    }
    if (transform === Number) {
      return Number(field)
    }
    if (transform === Date) {
      return (field as Date).toISOString()
    }

    throw new Error(`${this.type.name} ${JSON.stringify(field)}`)
  }

  deserialize (json: Json): T {
    const instance = new this.type()
    for (const key in this.transforms) {
      const field = json[key]
      const transform = this.transforms[key]
      if (field === undefined || transform == null) {
        continue
      }

      instance[key] = this.deserializeField(field, transform)
    }
    return instance
  }

  deserializeField (field: JsonField, transform: Transform | ISerializer<any>): any {
    if (field == null) {
      return null
    }
    if (isSerializer(transform)) {
      return transform.deserialize(field as Json)
    }
    if (transform === String) {
      return String(field)
    }
    if (transform === Boolean) {
      return Boolean(field)
    }
    if (transform === Number) {
      return Number(field)
    }
    if (transform === Date) {
      return new Date(field as string)
    }

    throw new Error(`${this.type.name} ${JSON.stringify(field)}`)
  }
}

declare module Serializer {
  type Array<T> = ArraySerializer<T>
}

export default Serializer
