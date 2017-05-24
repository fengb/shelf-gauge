import * as Typeorm from 'typeorm'
import { RepoCommit, RepoAuth, User } from '.'

export type RepoSource = 'github' | 'manual'

@Typeorm.Entity()
@Typeorm.Index(['source', 'name'], { unique: true })
class Repo {
  static SOURCES = ['github', 'manual'] as RepoSource[]

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

  @Typeorm.OneToMany(type => RepoCommit, commit => commit.repo, { cascadeInsert: true })
  commits: RepoCommit[]

  @Typeorm.ManyToMany(type => User, user => user.repos, { cascadeInsert: true })
  users: User[]
}

declare namespace Repo {
  export type Source = RepoSource
}

export default Repo
