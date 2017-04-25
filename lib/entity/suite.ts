import * as Typeorm from 'typeorm'
import { autoserialize, autoserializeAs } from 'cerialize'
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

  @Typeorm.OneToMany(type => SuiteMetum, metum => metum.suite)
  @autoserializeAs(() => SuiteMetum)
  meta: SuiteMetum[]

  @Typeorm.OneToMany(type => SuiteTest, test => test.suite)
  @autoserializeAs(() => SuiteTest)
  tests: SuiteTest[]
}
