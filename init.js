process.env.NODE_ENV = process.env.NODE_ENV || 'development'

const dotenv = require('dotenv')
dotenv.config({ path: `.env.${process.env.NODE_ENV}` })
dotenv.config({ path: '.env' })

process.env.NODE_PATH = [process.env.NODE_PATH, __dirname]
                        .filter((x) => x)
                        .join(':')
require('module')._initPaths()
