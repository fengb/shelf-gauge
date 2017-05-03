import { config } from 'dotenv'

process.env.NODE_ENV = process.env.NODE_ENV || 'development'

config({ path: '.env' })
config({ path: `.env.${process.env.NODE_ENV}` })

function get<T> (key: string, defawlt: T | undefined, coerce: (str: string) => T): T {
  const value: string = process.env[key]
  if (value != null) {
    return coerce(value)
  }

  if (defawlt != null) {
    return defawlt
  }

  throw new Error(`${key} not defined`)
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

// TODO: report all errors at once
export default {
  server: {
    port:               num('PORT', 12345),
    secretKeys:         str('SECRET_KEY').split(' '),
  },

  database: {
    url:                str('DATABASE_URL'),
    logging:            bool('DATABASE_LOGGING', false),
  },

  oauth: {
    github: {
      id:               str('OAUTH_GITHUB_ID'),
      secret:           str('OAUTH_GITHUB_SECRET'),
      callback:         str('OAUTH_GITHUB_CALLBACK'),
    },
  },

  promise: {
    stacktrace:         bool('PROMISE_STACKTRACE', false),
  },
}
