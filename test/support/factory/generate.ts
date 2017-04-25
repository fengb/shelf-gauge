import { ColumnMetadata } from 'typeorm/metadata/ColumnMetadata'
import { ColumnType } from 'typeorm/metadata/types/ColumnTypes'
import * as faker from 'faker'

function generateString (): string {
  return faker.lorem.words()
}

function generateText (): string {
  return faker.lorem.paragraph()
}

function generateInt (): number {
  return faker.random.number()
}

function generateDouble (): number {
  return Math.random()
}

function generateDecimal (): string {
  return faker.random.number().toString()
}

function generateDate (): Date {
  return faker.date.recent()
}

function generateBoolean (): boolean {
  return faker.random.boolean()
}

function generateUuid (): string {
  return faker.random.uuid()
}

type MappingType = {
  [P in ColumnType]: () => boolean | number | string | Date | {}
}

const mapping: MappingType = {
  string: generateString,
  number: generateDouble,
  text: generateText,
  boolean: generateBoolean,
  integer: generateInt,
  int: generateInt,
  smallint: generateInt,
  bigint: generateInt,
  float: generateDouble,
  double: generateDouble,
  decimal: generateDecimal,
  date: generateDate,
  time: generateDate,
  datetime: generateDate,
  json: () => new Object,
  jsonb: () => new Object,
  simple_array: () => [],
  uuid: generateUuid
}

export default function generate (c: ColumnMetadata): any {
  const generator = mapping[c.type]
  return generator()
}
