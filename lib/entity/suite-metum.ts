import * as Typeorm from 'typeorm'
import { autoserialize } from 'cerialize'
import { Suite } from '.'

@Typeorm.Entity()
export default class SuiteMeta {
  @Typeorm.PrimaryGeneratedColumn()
  id: number

  @Typeorm.ManyToOne(type => Suite, suite => suite.tests)
  suite: Suite

  @Typeorm.Column()
  @autoserialize
  name: string

  @Typeorm.Column()
  @autoserialize
  value: string
}
