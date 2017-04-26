require('app-module-path').addPath(__dirname + '/..')

require('reflect-metadata')

process.env.NODE_ENV = process.env.NODE_ENV || 'development'

const dotenv = require('dotenv')
dotenv.config({ path: '.env' })
dotenv.config({ path: `.env.${process.env.NODE_ENV}` })

global.Promise = require('bluebird')
