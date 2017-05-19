import * as Typeorm from 'typeorm'

import ENV from 'config/env'
import { Repo } from '.'

@Typeorm.Entity()
export default class RepoCommit {
  constructor (attrs: Partial<RepoCommit> = {}) {
    Object.assign(this, attrs)
  }

  @Typeorm.PrimaryGeneratedColumn()
  id: number

  @Typeorm.Column()
  @Typeorm.Index()
  ref: string

  @Typeorm.Column()
  @Typeorm.Index()
  parent: string

  @Typeorm.ManyToOne(type => Repo, repo => repo.commits)
  repo: Repo
}
