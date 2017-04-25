import { ColumnMetadata } from 'typeorm/metadata/ColumnMetadata'
import { ColumnType } from 'typeorm/metadata/types/ColumnTypes'
import * as faker from 'faker'

function _string (): string {
  return faker.lorem.words()
}

function _text (): string {
  return faker.lorem.paragraph()
}

function _int (): number {
  return faker.random.number()
}

function _double (): number {
  return Math.random()
}

function _decimal (): string {
  return faker.random.number().toString()
}

function _date (): Date {
  return faker.date.recent()
}

function _boolean (): boolean {
  return faker.random.boolean()
}

function _uuid (): string {
  return faker.random.uuid()
}

type MappingType = {
  [P in ColumnType]: () => boolean | number | string | Date | {}
}

const mapping: MappingType = {
  string: _string,
  number: _double,
  text: _text,
  boolean: _boolean,
  integer: _int,
  int: _int,
  smallint: _int,
  bigint: _int,
  float: _double,
  double: _double,
  decimal: _decimal,
  date: _date,
  time: _date,
  datetime: _date,
  json: () => new Object,
  jsonb: () => new Object,
  simple_array: () => [],
  uuid: _uuid
}

export default function generate (c: ColumnMetadata): any {
  const generator = mapping[c.type]
  return generator()
}
