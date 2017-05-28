import ENV from 'config/env'

import { map, keyBy, partition } from 'lodash'

import * as github from 'src/service/github'
import { Repo, RepoCommit } from 'src/entity'
import { connect } from 'src/server/connection'

export async function fromGithub (repo: Repo, ref?: string) {
  const response = await github.fetchCommits(repo.name, ref)
  const commits = github.toCommits(response.data, { repo })
  return upsert(commits)
}

export async function upsert (commits: RepoCommit[]) {
  const conn = await connect()
  const dbCommits = await conn.entityManager
                    .createQueryBuilder(RepoCommit, 'commit')
                    .where('commit.lookup IN (:lookups)', { lookups: map(commits, 'lookup') })
                    .getMany()

  const lookup = keyBy(dbCommits, 'lookup')
  const [existing, needSaving] = partition(commits, (commit) => lookup[commit.lookup])
  for (const commit of existing) {
    commit.id = lookup[commit.lookup].id
  }
  await conn.entityManager.persist(needSaving)
  return commits
}

export default function (repo: Repo, ref?: string) {
  switch (repo.source) {
    case 'github': return fromGithub(repo, ref)
    default: return Promise.reject(new Error(`Cannot load commits for Repo<${repo.name}>`))
  }
}
