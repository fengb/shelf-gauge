export interface Json {
  [key: string]: null | string | boolean | number | Array<Json> | Json
}

export type JsonField = null | string | boolean | number | Array<Json> | Json

type Constructor<T> = {
  new (): T
}

export interface Serializer<T> {
  serialize (value: T): JsonField
  deserialize (json: JsonField): T
}

export const STRING: Serializer<string> = {
  serialize: String,
  deserialize: String,
}

export const BOOLEAN: Serializer<boolean> = {
  serialize: Boolean,
  deserialize: Boolean,
}

export const NUMBER: Serializer<number> = {
  serialize: Number,
  deserialize: Number,
}

export const DATE: Serializer<Date> = {
  serialize: (value) => value.toISOString(),
  deserialize: (json) => new Date(json as string),
}

class ArraySerializer<T> implements Serializer<Array<T>> {
  private serializer: ObjectSerializer<T>

  constructor (type: Constructor<T>, transforms: { [P in keyof T]?: Serializer<T[P]> }) {
    this.serializer = new ObjectSerializer(type, transforms)
  }

  serialize(instances: Array<T>): JsonField {
    return instances.map((inst) => this.serializer.serialize(inst))
  }

  deserialize(json: JsonField): Array<T> {
    return (json as Array<JsonField>).map((field) => this.serializer.deserialize(field as any))
  }
}

export default class ObjectSerializer<T> implements Serializer<T> {
  static Array = ArraySerializer
  static String = STRING
  static Boolean = BOOLEAN
  static Number = NUMBER
  static Date = DATE

  constructor (private type: Constructor<T>, private transforms: { [P in keyof T]?: Serializer<T[P]> }) {
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
}
