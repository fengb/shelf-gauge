import { ObjectType } from 'typeorm'
import { EntityMetadata } from 'typeorm/metadata/EntityMetadata'
import { db } from '..'
import generate from './generate'

function buildFromMetadata (metadata: EntityMetadata, props?: any): any {
  const entity: any = metadata.create()
  if (props) {
    Object.assign(entity, props)
  }

  for (const columnMetadata of metadata.columns) {
    const prop = columnMetadata.propertyName
    entity[prop] = entity[prop] || generate(columnMetadata)
  }

  for (const relation of metadata.multiValueRelations) {
    const prop = relation.propertyName
    entity[prop] = entity[prop] || []
  }

  for (const relation of metadata.singleValueRelations) {
    const prop = relation.propertyName
    entity[prop] = entity[prop] || buildFromMetadata(relation.entityMetadata)
  }

  return entity
}

export async function build<Entity> (entityClass: ObjectType<Entity>, props?: Partial<Entity>): Promise<Entity> {
  const connection = await db.connect()
  const metadata = connection.getMetadata(entityClass)
  return buildFromMetadata(metadata, props)
}
