import * as Typeorm from 'typeorm'
import * as bcrypt from 'bcryptjs'

import ENV from 'config/env'
import { Repo, User } from '.'
import * as promise from 'lib/util/promise'

const KEY_PREFIX_LENGTH = 6

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
  encryptedKey?: string

  private _key: string

  get key () {
    return this._key
  }
  set key (value: string) {
    this.keyPrefix = value.substr(0, KEY_PREFIX_LENGTH)
    this._key = value
    this.encryptedKey = undefined

    this.settled.set('encryptedKey',
       bcrypt.hash(value, ENV.server.bcryptRounds)
       .then((encrypted) => this.encryptedKey = encrypted)
    )
  }

  settled = promise.resolver()

  async matches (value: string): Promise<boolean> {
    return value.startsWith(this.keyPrefix)
        && this.encryptedKey !== undefined
        && bcrypt.compare(value, this.encryptedKey)
  }

  @Typeorm.Column({ nullable: true })
  disabledAt: Date
}
