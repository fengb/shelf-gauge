import 'reflect-metadata'
import * as Bluebird from 'bluebird'

import ENV from './env'

require('app-module-path').addPath(__dirname + '/..')

global.Promise = Bluebird
Bluebird.config({
  longStackTraces: ENV.promise.stacktrace,
})
