import * as Typeorm from 'typeorm'
import { RepoCommit, RepoSecret, User } from '.'

export type RepoSource = 'github' | 'manual'

@Typeorm.Entity()
export default class Repo {
  constructor (attrs: Partial<Repo> = {}) {
    Object.assign(this, attrs)
  }

  @Typeorm.PrimaryGeneratedColumn()
  id: number

  @Typeorm.Column()
  @Typeorm.Index({ unique: true })
  url: string

  @Typeorm.Column()
  source: RepoSource

  @Typeorm.Column()
  name: string

  @Typeorm.OneToMany(type => RepoSecret, secret => secret.repo)
  secrets: RepoSecret[]

  @Typeorm.OneToMany(type => RepoCommit, commit => commit.repo)
  commits: RepoCommit[]

  @Typeorm.ManyToMany(type => User, user => user.repos, { cascadeInsert: true })
  users: User[]
}
