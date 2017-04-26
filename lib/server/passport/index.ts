import * as passport from 'koa-passport'
import github from './github'
import { User } from 'lib/entity'
import { connect } from '../connection'

passport.use(github())
passport.serializeUser((user: any, done) => {
  done(null, user.id)
})
passport.deserializeUser(async (id, done) => {
  try {
    const connection = await connect()
    const user = await connection.entityManager.findOne(User, { id })
    done(null, user)
  } catch (err) {
    done(err, null)
  }
})

export default passport
