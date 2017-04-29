import * as Typeorm from 'typeorm'

@Typeorm.Entity()
export default class User {
  @Typeorm.PrimaryGeneratedColumn()
  id: number

  @Typeorm.Column()
  @Typeorm.Index({ unique: true })
  githubId: string

  @Typeorm.Column()
  githubToken: string

  @Typeorm.Column()
  @Typeorm.Index({ unique: true })
  username: string
}
