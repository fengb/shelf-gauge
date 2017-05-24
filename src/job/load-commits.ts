import ENV from 'config/env'

import { flatMap, partialRight } from 'lodash'

import * as github from 'src/service/github'
import { Repo, RepoCommit } from 'src/entity'
import { connect } from 'src/server/connection'

export async function fromGithub (repo: Repo) {
  const prom: any = await Promise.props({
    conn: connect(),
    response: github.fetchCommits(repo.name),
  })
  const commits = github.toCommits(prom.response.data, repo)
  await prom.conn.entityManager.persist(commits)
  return commits
}
