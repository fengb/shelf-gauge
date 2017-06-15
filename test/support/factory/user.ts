import { define, faker } from "./helper";
import { User } from "src/entity";

export default define(User, user => ({
  githubId: () => String(faker.random.number()),
  githubToken: faker.random.uuid,
  username: faker.internet.userName
}));
