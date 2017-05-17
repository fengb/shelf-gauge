import * as Typeorm from 'typeorm'
import { Suite } from '.'

export type EnvSource = 'travis' | 'circle' | 'misc'

@Typeorm.Entity()
export default class SuiteEnv {
  constructor (attrs: Partial<SuiteEnv> = {}) {
    Object.assign(this, attrs)
  }

  @Typeorm.PrimaryGeneratedColumn()
  id: number

  @Typeorm.OneToOne(type => Suite, suite => suite.env)
  @Typeorm.JoinColumn()
  suite: Suite

  @Typeorm.Column()
  @Typeorm.Index()
  source: EnvSource

  @Typeorm.Column('text')
  info: string
}
