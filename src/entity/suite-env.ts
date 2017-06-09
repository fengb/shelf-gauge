import * as Typeorm from "typeorm";
import { Suite } from ".";

export type EnvSource = "travis" | "circle" | "misc";

@Typeorm.Entity()
class SuiteEnv {
  static SOURCES = ["travis", "circle", "misc"] as EnvSource[];

  constructor(attrs: Partial<SuiteEnv> = {}) {
    Object.assign(this, attrs);
  }

  @Typeorm.PrimaryGeneratedColumn() id: number;

  @Typeorm.OneToOne(type => Suite, suite => suite.env)
  @Typeorm.JoinColumn()
  suite: Suite;

  @Typeorm.Column()
  @Typeorm.Index()
  source: EnvSource;

  @Typeorm.Column("text") info: string;
}

declare namespace SuiteEnv {
  export type Source = EnvSource;
}

export default SuiteEnv;
