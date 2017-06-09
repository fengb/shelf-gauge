import * as passport from "koa-passport";

import github from "./github";
import mock from "./mock";
import { toSession, fromSession } from "./user";

passport.use(github);
if (mock) {
  passport.use(mock!);
}
passport.serializeUser(toSession);
passport.deserializeUser(fromSession);

export default passport;
