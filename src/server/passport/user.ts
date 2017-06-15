import { assign } from "lodash";
import { needsAssign } from "src/util/iter";
import { User } from "src/entity";
import { connect } from "../connection";

export async function fetch(
  identifier: Partial<User>,
  updates?: Partial<User>
): Promise<User> {
  const connection = await connect();
  const user =
    (await connection.entityManager.findOne(User, identifier)) ||
    connection.entityManager.create(User, identifier);

  if (updates && needsAssign(user, updates)) {
    assign(user, updates);
    await connection.entityManager.persist(user);
  }

  return user;
}
