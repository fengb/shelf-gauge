import { ObjectType } from 'typeorm'
import { db } from '..'
import generate from './generate'

export async function build<Entity> (entityClass: ObjectType<Entity>): Promise<Entity> {
  const connection = await db.connect()
  const metadata = connection.getMetadata(entityClass)
  const entity: any = metadata.create()
  for (const columnMetadata of metadata.allColumns) {
    const prop = columnMetadata.propertyName
    entity[prop] = generate(columnMetadata)
  }
  return entity
}
