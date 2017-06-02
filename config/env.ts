import { config } from 'dotenv'

process.env.NODE_ENV = process.env.NODE_ENV || 'development'

config({ path: '.env' })
config({ path: `.env.${process.env.NODE_ENV}` })

const MISSING = [] as string[]

function get<T> (key: string, defawlt: T | undefined, coerce: (str: string) => T): T {
  const value: string = process.env[key]
  if (value != null) {
    return coerce(value)
  }

  if (defawlt != null) {
    return defawlt
  }

  MISSING.push(key)
  return null as any
}

function str (key: string, defawlt?: string): string {
  return get(key, defawlt, String)
}

function num (key: string, defawlt?: number): number {
  return get(key, defawlt, parseInt)
}

function bool (key: string, defawlt?: boolean): boolean {
  return get(key, defawlt, (str) => ('tTyY'.includes(str[0])))
}

export default {
  nodeEnv:              str('NODE_ENV'),

  server: {
    baseUrl:            str('BASE_URL'),
    clusterSize:        num('CLUSTER_SIZE', 2),
    port:               num('PORT', 12345),
    secretKeys:         str('SECRET_KEY').split(' '),
    bcryptRounds:       num('BCRYPT_ROUNDS'),
    useLogger:          bool('USE_LOGGER', true),
  },

  monitor: {
    rollbarToken:       str('MONITOR_ROLLBAR_TOKEN', ''),
  },

  database: {
    url:                str('DATABASE_URL'),
    logging:            bool('DATABASE_LOGGING', false),
    autoSync:           bool('DATABASE_AUTOSYNC', false),
  },

  oauth: {
    mock:               bool('OAUTH_MOCK', false),
    github: {
      id:               str('OAUTH_GITHUB_ID'),
      secret:           str('OAUTH_GITHUB_SECRET'),
    },
  },

  promise: {
    stacktrace:         bool('PROMISE_STACKTRACE', false),
  },
}

if (MISSING.length > 0) {
  throw new Error(`ENV variables not defined: ${MISSING.join(', ')}`)
}
