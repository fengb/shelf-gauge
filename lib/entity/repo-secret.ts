import * as Typeorm from 'typeorm'
import { Repo, User } from '.'

const KEY_PREFIX_LENGTH = 6

@Typeorm.Entity()
export default class RepoSecret {
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
    this.keyPrefix = value.substr(0, 6)
    this.encryptedKey = value
    this._key = value
  }

  matches (value: string) {
    return value.startsWith(this.keyPrefix) && this.encryptedKey === value
  }

  @Typeorm.Column({ nullable: true })
  disabledAt: Date
}
