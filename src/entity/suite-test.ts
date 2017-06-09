import * as Typeorm from "typeorm";
import { Suite } from ".";

@Typeorm.Entity()
export default class SuiteTest {
  constructor(attrs: Partial<SuiteTest> = {}) {
    Object.assign(this, attrs);
  }

  @Typeorm.PrimaryGeneratedColumn() id: number;

  @Typeorm.ManyToOne(type => Suite, suite => suite.tests)
  suite: Suite;

  @Typeorm.Column()
  @Typeorm.Index()
  name: string;

  @Typeorm.Column() value: number;
}
