import { Strategy, StrategyOption } from 'passport-github'

import ENV from 'config/env'
import { fetch } from './user'

const OPTIONS: StrategyOption = {
  clientID: ENV.oauth.github.id,
  clientSecret: ENV.oauth.github.secret,
  callbackURL: ENV.server.baseUrl + '/auth/github',
  scope: ['public_repo'],
}

export default new Strategy(OPTIONS, (accessToken, refreshToken, profile, done) => {
  fetch({ githubId: profile.id }, {
    username: profile.username,
    githubToken: accessToken,
  })
  .asCallback(done)
})
