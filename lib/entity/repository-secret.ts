import * as Typeorm from 'typeorm'
import { Repository, User } from '.'

@Typeorm.Entity()
export default class RepositorySecret {
  @Typeorm.PrimaryGeneratedColumn()
  id: number

  // Default nullable: false
  @Typeorm.ManyToOne(type => Repository, repo => repo.secrets, { nullable: false })
  repository: Repository

  @Typeorm.Column()
  @Typeorm.Index()
  key: string

  @Typeorm.Column({ nullable: true })
  disabledAt: Date
}
