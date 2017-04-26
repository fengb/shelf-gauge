import * as Typeorm from 'typeorm'
import { autoserialize } from 'cerialize'
import { Suite } from '.'

export type EnvSource = 'travis' | 'circle' | 'misc'

@Typeorm.Entity()
export default class SuiteEnv {
  @Typeorm.PrimaryGeneratedColumn()
  id: number

  @Typeorm.OneToOne(type => Suite, suite => suite.env)
  @Typeorm.JoinColumn()
  suite: Suite

  @Typeorm.Column()
  @Typeorm.Index()
  @autoserialize
  source: EnvSource

  @Typeorm.Column('text')
  @autoserialize
  info: string
}
