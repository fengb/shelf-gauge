import { Strategy, StrategyOption } from 'passport-github'

import env from 'config/env'
import { fetch } from './user'

const OPTIONS: StrategyOption = {
  clientID: env.githubClient.id,
  clientSecret: env.githubClient.secret,
  callbackURL: env.githubClient.callback,
}

export default new Strategy(OPTIONS, (accessToken, refreshToken, profile, done) => {
  fetch({ githubId: profile.id }, {
    username: profile.username,
    githubToken: accessToken,
  })
  .asCallback(done)
})
