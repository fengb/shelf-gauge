import { once } from "lodash";

import ENV from "config/env";

import * as HttpStatus from "src/util/http-status";
import { User } from "src/entity";
import server from "src/server";

import { chai, db } from ".";

export const app = once(() => server.callback());

export function request(): ChaiHttp.Agent {
  return chai.request.agent(app());
}

interface AuthAgent extends ChaiHttp.Agent {
  user: User;
}

export async function withAuth(): Promise<AuthAgent> {
  const agent = request() as AuthAgent;
  await agent.get("/auth/mock");
  // TODO: get the real user
  const conn = await db.connect();
  agent.user = (await conn.entityManager.findOne(User)) as User;
  return agent;
}

export default Object.assign(request, { app, withAuth, HttpStatus });
