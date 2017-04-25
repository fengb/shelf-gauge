import * as Typeorm from 'typeorm'
import { autoserialize, autoserializeAs, serialize } from 'cerialize'
import { Repository, SuiteMetum, SuiteTest } from '.'

@Typeorm.Entity()
export default class Suite {
  @Typeorm.PrimaryGeneratedColumn()
  @autoserialize
  id: number

  @Typeorm.ManyToOne(type => Repository, repo => repo.suites)
  repository: Repository

  @Typeorm.Column()
  @autoserialize
  ref: string

  @Typeorm.Column(Date)
  @autoserialize
  ranAt: Date

  @Typeorm.Column(Date)
  @serialize
  createdAt: Date

  @Typeorm.OneToMany(type => SuiteMetum, metum => metum.suite)
  @autoserializeAs(() => SuiteMetum)
  meta: SuiteMetum[]

  @Typeorm.OneToMany(type => SuiteTest, test => test.suite)
  @autoserializeAs(() => SuiteTest)
  tests: SuiteTest[]
}
