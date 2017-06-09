import * as Typeorm from "typeorm";

import { Repo } from ".";

@Typeorm.Entity()
export default class RepoCommit {
  constructor(attrs: Partial<RepoCommit> = {}) {
    Object.assign(this, attrs);
  }

  @Typeorm.PrimaryGeneratedColumn() id: number;

  @Typeorm.Column()
  @Typeorm.Index()
  ref: string;

  @Typeorm.Column()
  @Typeorm.Index()
  parent: string;

  @Typeorm.Column()
  @Typeorm.Index({ unique: true })
  get lookup(): string {
    return `${this.ref}~${this.parent}`;
  }
  set lookup(value: string) {
    // Ignore: defined by ref~parent
  }

  @Typeorm.ManyToOne(type => Repo, repo => repo.commits)
  repo: Repo;
}
