import { assign } from "lodash";
import { needsAssign } from "src/util/iter";
import { User } from "src/entity";
import { connect } from "../connection";

export async function findOrCreate(
  search: Partial<User>,
  updates?: Partial<User>
): Promise<User> {
  const conn = await connect();
  const user = (await find(search)) || new User(search);

  if (updates && needsAssign(user, updates)) {
    assign(user, updates);
    await conn.entityManager.persist(user);
  }

  return user;
}

export async function find(search: Partial<User>): Promise<User | undefined> {
  const conn = await connect();
  return conn.entityManager.findOne(User, search);
}
