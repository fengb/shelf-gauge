import * as Typeorm from 'typeorm'
import { autoserialize, serialize } from 'cerialize'
import { RepoSecret, SuiteEnv, SuiteTest, User } from '.'

@Typeorm.Entity()
export default class Suite {
  @Typeorm.PrimaryGeneratedColumn()
  id: number

  @Typeorm.ManyToOne(type => RepoSecret, {nullable: false})
  repoSecret: RepoSecret

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

  @Typeorm.OneToOne(type => SuiteEnv, env => env.suite, { nullable: false, cascadeAll: true })
  @autoserialize
  env: SuiteEnv

  @Typeorm.OneToMany(type => SuiteTest, test => test.suite, { cascadeInsert: true })
  @autoserialize
  tests: SuiteTest[]
}
