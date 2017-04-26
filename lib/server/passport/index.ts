import * as passport from 'passport'
import github from './github'

passport.use(github())

import * as koaPassport from 'koa-passport'
export default koaPassport
