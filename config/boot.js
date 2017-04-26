const path = require('path')

process.env.NODE_ENV = process.env.NODE_ENV || 'development'

const dotenv = require('dotenv')
dotenv.config({ path: `.env.${process.env.NODE_ENV}` })
dotenv.config({ path: '.env' })

const PROJECT_DIR = path.resolve(__dirname, '..')
process.env.NODE_PATH = [process.env.NODE_PATH, PROJECT_DIR]
                        .filter((x) => x)
                        .join(':')
require('module')._initPaths()

global.Promise = require('bluebird')
