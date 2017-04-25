import { ColumnMetadata } from 'typeorm/metadata/ColumnMetadata'
import { ColumnType } from 'typeorm/metadata/types/ColumnTypes'

function generateString (): string {
  return ''
}

function generateText (): string {
  return ''
}

function generateInt (): number {
  return 0
}

function generateDouble (): number {
  return 0
}

function generateDecimal (): string {
  return ''
}

function generateDate (): Date {
  return new Date()
}

function generateBoolean (): boolean {
  return false
}

function generateUuid (): string {
  return '3498239487'
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
