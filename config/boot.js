const path = require('path')
const PROJECT_DIR = path.resolve(__dirname, '..')
require('app-module-path').addPath(PROJECT_DIR)

require('reflect-metadata')

process.env.NODE_ENV = process.env.NODE_ENV || 'development'

const dotenv = require('dotenv')
dotenv.config({ path: `.env.${process.env.NODE_ENV}` })
dotenv.config({ path: '.env' })

global.Promise = require('bluebird')
