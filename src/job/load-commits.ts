import ENV from 'config/env'

import { flatMap, partialRight } from 'lodash'

import * as github from 'src/service/github'
import { Repo, RepoCommit } from 'src/entity'
import { connect } from 'src/server/connection'

export async function fromGithub (repo: Repo, ref?: string) {
  const prom: any = await Promise.props({
    conn: connect(),
    response: github.fetchCommits(repo.name, ref),
  })
  const commits = github.toCommits(prom.response.data, repo)
  await prom.conn.entityManager.persist(commits)
  return commits
}

export default function (repo: Repo, ref?: string) {
  if (repo.source === 'github') {
    return fromGithub(repo, ref)
  } else {
    return Promise.reject(new Error(`Cannot load commits for Repo<${repo.name}>`))
  }
}
