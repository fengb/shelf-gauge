import * as Typeorm from 'typeorm'
import { autoserialize, autoserializeAs, serialize } from 'cerialize'
import { RepositorySecret, SuiteEnv, SuiteTest, User } from '.'

@Typeorm.Entity()
export default class Suite {
  @Typeorm.PrimaryGeneratedColumn()
  @autoserialize
  id: number

  @Typeorm.ManyToOne(type => RepositorySecret, {nullable: false})
  repositorySecret: RepositorySecret

  @Typeorm.Column()
  @autoserialize
  ref: string

  @Typeorm.Column()
  @autoserialize
  name: string

  @Typeorm.Column(Date)
  @autoserialize
  ranAt: Date

  @Typeorm.Column(Date)
  @serialize
  createdAt: Date

  @Typeorm.OneToOne(type => SuiteEnv, env => env.suite)
  @autoserializeAs(() => SuiteEnv)
  env: SuiteEnv

  @Typeorm.OneToMany(type => SuiteTest, test => test.suite)
  @autoserializeAs(() => SuiteTest)
  tests: SuiteTest[]
}
