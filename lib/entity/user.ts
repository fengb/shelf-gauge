import * as Typeorm from 'typeorm'
import Suite from './suite'

@Typeorm.Entity()
export default class User {
  @Typeorm.PrimaryGeneratedColumn()
  id: number

  @Typeorm.Column()
  @Typeorm.Index({ unique: true })
  githubId: number

  @Typeorm.Column()
  @Typeorm.Index({ unique: true })
  username: string
}
