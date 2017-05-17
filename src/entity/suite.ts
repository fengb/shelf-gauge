import * as Typeorm from 'typeorm'
import { RepoSecret, SuiteEnv, SuiteTest, User } from '.'

@Typeorm.Entity()
export default class Suite {
  constructor (attrs: Partial<Suite> = {}) {
    Object.assign(this, attrs)
  }

  @Typeorm.PrimaryGeneratedColumn()
  id: number

  @Typeorm.ManyToOne(type => RepoSecret, {nullable: false})
  repoSecret: RepoSecret

  @Typeorm.Column()
  ref: string

  @Typeorm.Column()
  name: string

  @Typeorm.Column(Date)
  ranAt: Date

  @Typeorm.Column(Date)
  createdAt: Date

  @Typeorm.OneToOne(type => SuiteEnv, env => env.suite, { nullable: false, cascadeAll: true })
  env: SuiteEnv

  @Typeorm.OneToMany(type => SuiteTest, test => test.suite, { cascadeInsert: true })
  tests: SuiteTest[]
}
