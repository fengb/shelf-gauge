import * as Typeorm from 'typeorm'
import { RepoCommit, RepoAuth, User } from '.'

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

  @Typeorm.OneToMany(type => RepoAuth, auth => auth.repo)
  auths: RepoAuth[]

  @Typeorm.OneToMany(type => RepoCommit, commit => commit.repo)
  commits: RepoCommit[]

  @Typeorm.ManyToMany(type => User, user => user.repos, { cascadeInsert: true })
  users: User[]
}
