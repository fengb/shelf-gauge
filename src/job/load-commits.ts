import ENV from 'config/env'

import { map, keyBy, filter } from 'lodash'

import * as github from 'src/service/github'
import { Repo, RepoCommit } from 'src/entity'
import { connect } from 'src/server/connection'

export async function fromGithub (repo: Repo, ref?: string) {
  const response = await github.fetchCommits(repo.name, ref)
  const commits = github.toCommits(response.data, repo)
  return upsert(commits)
}

function hashify (commit: RepoCommit) {
  return `${commit.ref}~${commit.parent}`
}

export async function upsert (commits: RepoCommit[]) {
  const conn = await connect()
  const dbCommits = await conn.entityManager
                    .createQueryBuilder(RepoCommit, 'commit')
                    .where('commit.ref IN (:refs)', {
                      refs: map(commits, 'ref'),
                    })
                    .getMany()

  const lookup = keyBy(dbCommits, hashify)
  const needSaving = []
  for (const commit of commits) {
    const fromDb = lookup[hashify(commit)]
    if (fromDb) {
      commit.id = fromDb.id
    } else {
      needSaving.push(commit)
    }
  }
  await conn.entityManager.persist(needSaving)
  return commits
}

export default function (repo: Repo, ref?: string) {
  if (repo.source === 'github') {
    return fromGithub(repo, ref)
  } else {
    return Promise.reject(new Error(`Cannot load commits for Repo<${repo.name}>`))
  }
}
