import { build, define, sequence, randomize, faker } from "./helper";
import { Suite, SuiteEnv } from "src/entity";

export default define(SuiteEnv, env => ({
  suite: () => build(Suite, { env }),
  source: randomize(...SuiteEnv.SOURCES),
  info: faker.lorem.paragraph
}));
