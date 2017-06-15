import { once, assign } from "lodash";

import ENV from "config/env";

import * as HttpStatus from "src/util/http-status";
import server from "src/server";

import { chai } from ".";

export const app = once(() => server.callback());

export function request(): ChaiHttp.Agent {
  return chai.request.agent(app());
}

export default assign(request, { app, HttpStatus });
