import { Strategy } from 'passport'

import ENV from 'config/env'
import { fetch } from './user'

function create (): Strategy {
  return {
    name: 'mock',
    authenticate (this: any, req, options) {
      if (!req.query.__mock_strategy_callback) {
        return this.redirect(ENV.test!.auth.callback + '?__mock_strategy_callback=true')
      }

      if (this._error) {
        return this.fail(this._error, 401)
      }

      fetch({ githubId: '12345' }, {
        username: 'test',
        githubToken: ENV.test!.auth.github,
      }).then((user) => {
        this.success(user)
      })
    }
  }
}

export default ENV.test ? create() : undefined
