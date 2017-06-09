import * as Typeorm from "typeorm";
import { RepoAuth, SuiteEnv, SuiteTest, User } from ".";

@Typeorm.Entity()
export default class Suite {
  constructor(attrs: Partial<Suite> = {}) {
    Object.assign(this, attrs);
  }

  @Typeorm.PrimaryGeneratedColumn({})
  id: number;

  @Typeorm.ManyToOne(type => RepoAuth, { cascadeAll: true })
  repoAuth: RepoAuth;

  @Typeorm.Column({})
  ref: string;

  @Typeorm.Column({})
  name: string;

  @Typeorm.Column({ nullable: true })
  pullRequest: string;

  @Typeorm.Column({})
  ranAt: Date;

  @Typeorm.Column({})
  createdAt: Date;

  @Typeorm.OneToOne(type => SuiteEnv, env => env.suite, { cascadeAll: true })
  env: SuiteEnv;

  @Typeorm.OneToMany(type => SuiteTest, test => test.suite, {
    cascadeInsert: true
  })
  tests: SuiteTest[];

  get repo() {
    return this.repoAuth.repo;
  }
}
