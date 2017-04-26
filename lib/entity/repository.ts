import * as Typeorm from 'typeorm'
import Suite from './suite'

@Typeorm.Entity()
export default class Repository {
  @Typeorm.PrimaryGeneratedColumn()
  id: number

  @Typeorm.Column()
  @Typeorm.Index({ unique: true })
  name: string

  @Typeorm.OneToMany(type => Suite, suite => suite.repository)
  suites: Suite[]
}
