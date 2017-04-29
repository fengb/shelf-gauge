import * as Typeorm from 'typeorm'
import { RepositorySecret, Suite } from '.'

@Typeorm.Entity()
export default class Repository {
  @Typeorm.PrimaryGeneratedColumn()
  id: number

  @Typeorm.Column()
  @Typeorm.Index({ unique: true })
  name: string

  @Typeorm.OneToMany(type => RepositorySecret, secret => secret.repository)
  secrets: Suite[]
}
