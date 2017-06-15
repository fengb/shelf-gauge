import * as passport from "koa-passport";

import github from "./github";
import mock from "./mock";

passport.use(github);
if (mock) {
  passport.use(mock!);
}

export default passport;
