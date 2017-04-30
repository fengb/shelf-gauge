import * as Typeorm from 'typeorm'
import { Repository } from '.'

@Typeorm.Entity()
export default class RepositorySecret {
  @Typeorm.PrimaryGeneratedColumn()
  id: number

  @Typeorm.ManyToOne(type => Repository, repo => repo.secrets)
  repository: Repository

  @Typeorm.Column()
  @Typeorm.Index()
  key: string

  @Typeorm.Column({ nullable: true })
  disabledAt: Date
}
