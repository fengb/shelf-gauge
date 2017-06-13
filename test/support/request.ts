import { once, assign } from "lodash";

import ENV from "config/env";

import * as HttpStatus from "src/util/http-status";
import { User } from "src/entity";
import server from "src/server";

import { chai, db } from ".";

export const app = once(() => server.callback());

export function request(): ChaiHttp.Agent {
  return chai.request.agent(app());
}

export async function withAuth() {
  const agent = request();
  await agent.get("/auth/mock");
  // TODO: get the real user
  const conn = await db.connect();
  return assign(agent, {
    user: (await conn.entityManager.findOne(User)) as User
  });
}

export default assign(request, { app, withAuth, HttpStatus });
