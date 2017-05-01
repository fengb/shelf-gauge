import * as Typeorm from 'typeorm'
import { serialize } from 'cerialize'
import { RepositorySecret, User } from '.'

@Typeorm.Entity()
export default class Repository {
  @Typeorm.PrimaryGeneratedColumn()
  id: number

  @Typeorm.Column()
  @Typeorm.Index({ unique: true })
  @serialize
  name: string

  @Typeorm.OneToMany(type => RepositorySecret, secret => secret.repository)
  secrets: RepositorySecret[]

  @Typeorm.ManyToMany(type => User, user => user.repositories)
  users: User[]
}
