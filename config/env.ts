import './boot'

function get<T> (key: string, coerce: (value: string) => T, defawlt?: T): T {
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
  return get(key, String, defawlt)
}

function num (key: string, defawlt?: number): number {
  return get(key, parseInt, defawlt)
}

function bool (key: string, defawlt?: boolean): boolean {
  return get(key, Boolean, defawlt)
}

export default {
  server: {
    port:               num('PORT', 12345),
    secretKeys:         str('SECRET_KEY').split(' '),
  },

  db: {
    url:                str('DB_URL'),
  },

  githubClient: {
    id:                 str('GITHUB_CLIENT_ID'),
    secret:             str('GITHUB_CLIENT_SECRET'),
    callback:           str('GITHUB_CLIENT_CALLBACK'),
  }
}
