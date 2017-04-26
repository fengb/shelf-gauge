import './boot'

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

export default {
  server: {
    port:               num('PORT', 12345),
    secretKeys:         str('SECRET_KEY').split(' '),
  },

  db: {
    url:                str('DB_URL'),
    logging:            bool('DB_LOGGING', false),
  },

  githubClient: {
    id:                 str('GITHUB_CLIENT_ID'),
    secret:             str('GITHUB_CLIENT_SECRET'),
    callback:           str('GITHUB_CLIENT_CALLBACK'),
  }
}
