import * as Typeorm from 'typeorm'
import { RepositorySecret, User } from '.'

@Typeorm.Entity()
export default class Repository {
  @Typeorm.PrimaryGeneratedColumn()
  id: number

  @Typeorm.Column()
  @Typeorm.Index({ unique: true })
  name: string

  @Typeorm.OneToMany(type => RepositorySecret, secret => secret.repository)
  secrets: RepositorySecret[]

  @Typeorm.ManyToMany(type => User, user => user.repositories)
  users: User[]
}
