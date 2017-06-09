import * as Typeorm from "typeorm";
import * as bcrypt from "bcryptjs";

import ENV from "config/env";
import { Repo, User } from ".";

const PREFIX_LENGTH = 4;

@Typeorm.Entity()
export default class RepoAuth {
  constructor(attrs: Partial<RepoAuth> = {}) {
    Object.assign(this, attrs);
  }

  @Typeorm.PrimaryGeneratedColumn() id: number;

  @Typeorm.ManyToOne(type => Repo, repo => repo.auths, { cascadeAll: true })
  repo: Repo;

  @Typeorm.Column()
  @Typeorm.Index()
  prefix: string;

  @Typeorm.Column() encrypted: string;

  private _key: string;

  get key() {
    return this._key;
  }
  set key(value: string) {
    this.prefix = value.substr(0, PREFIX_LENGTH);
    this.encrypted = bcrypt.hashSync(value, ENV.server.bcryptRounds);
    this._key = value;
  }

  matches(value: string) {
    return (
      value.startsWith(this.prefix) && bcrypt.compareSync(value, this.encrypted)
    );
  }

  @Typeorm.Column({ nullable: true })
  disabledAt: Date;
}
