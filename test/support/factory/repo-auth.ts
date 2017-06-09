import { build, define, sequence, faker } from "./helper";
import { Repo, RepoAuth } from "src/entity";

export default define(RepoAuth, entity => ({
  repo: () => build(Repo, { auths: [entity] }),
  key: faker.internet.ipv6
}));
