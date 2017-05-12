import * as Github from 'github'
import { Repo } from 'lib/entity'

export const API = new Github()

interface Response<T> {
  data: T,
  meta: any,
}

interface GithubRepo {
  id: number
  name: string
  full_name: string
  description: string
  private: boolean
  fork: boolean
  url: string
  html_url: string

  permissions: {
    admin: boolean
    push: boolean
    pull: boolean
  }
}

export function toRepo (github: GithubRepo): Repo {
  return Object.assign(new Repo(), {
    source: 'github',
    name: github.full_name.replace('/', '~'),
    url: github.html_url,
  })
}

export function fetchRepos (oauthToken: string): Promise<Response<GithubRepo[]>> {
  API.authenticate({ type: 'oauth', token: oauthToken })
  return API.repos.getAll({
    sort: "updated",
    per_page: 100,
  })
}

export function fetchRepo (oauthToken: string, name: string): Promise<Response<GithubRepo>> {
  const [owner, repo] = name.split('~')
  API.authenticate({ type: 'oauth', token: oauthToken })
  return API.repos.get({ owner, repo })
}
