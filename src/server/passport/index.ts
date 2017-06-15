import * as passport from "koa-passport";

import github from "./github";
import bearer from "./bearer";
import mock from "./mock";

export default passport.use(github).use(bearer);
