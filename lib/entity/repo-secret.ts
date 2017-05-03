import * as Typeorm from 'typeorm'
import { Repo, User } from '.'

@Typeorm.Entity()
export default class RepoSecret {
  @Typeorm.PrimaryGeneratedColumn()
  id: number

  // Default nullable: false
  @Typeorm.ManyToOne(type => Repo, repo => repo.secrets, { nullable: false, cascadeAll: true })
  repo: Repo

  @Typeorm.Column()
  @Typeorm.Index()
  key: string

  @Typeorm.Column({ nullable: true })
  disabledAt: Date
}
