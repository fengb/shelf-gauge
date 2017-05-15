import * as Typeorm from 'typeorm'
import * as bcrypt from 'bcryptjs'

import ENV from 'config/env'
import { Repo, User } from '.'

const KEY_PREFIX_LENGTH = 4

@Typeorm.Entity()
export default class RepoSecret {
  constructor (attrs: Partial<RepoSecret> = {}) {
    Object.assign(this, attrs)
  }

  @Typeorm.PrimaryGeneratedColumn()
  id: number

  // Default nullable: false
  @Typeorm.ManyToOne(type => Repo, repo => repo.secrets, { nullable: false, cascadeAll: true })
  repo: Repo

  @Typeorm.Column()
  @Typeorm.Index()
  keyPrefix: string

  @Typeorm.Column()
  encryptedKey: string

  private _key: string

  get key () {
    return this._key
  }
  set key (value: string) {
    this.keyPrefix = value.substr(0, KEY_PREFIX_LENGTH)
    this.encryptedKey = bcrypt.hashSync(value, ENV.server.bcryptRounds)
    this._key = value
  }

  matches (value: string) {
    return value.startsWith(this.keyPrefix)
        && bcrypt.compareSync(value, this.encryptedKey)
  }

  @Typeorm.Column({ nullable: true })
  disabledAt: Date
}
