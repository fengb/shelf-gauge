import * as Typeorm from 'typeorm'
import { serialize } from 'cerialize'
import { RepoSecret, User } from '.'

@Typeorm.Entity()
export default class Repo {
  @Typeorm.PrimaryGeneratedColumn()
  id: number

  @Typeorm.Column()
  @Typeorm.Index({ unique: true })
  @serialize
  url: string

  @Typeorm.Column()
  @Typeorm.Index({ unique: true })
  @serialize
  name: string

  @Typeorm.OneToMany(type => RepoSecret, secret => secret.repo)
  secrets: RepoSecret[]

  @Typeorm.ManyToMany(type => User, user => user.repos, { cascadeInsert: true })
  users: User[]
}
