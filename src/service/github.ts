import ENV from "config/env";

import * as Github from "github";

import { Repo, RepoCommit } from "src/entity";

export const API = new Github();

const MAX_PER_PAGE = 100;

interface Response<T> {
  data: T;
  meta: any;
}

interface GithubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string;
  private: boolean;
  fork: boolean;
  url: string;
  html_url: string;

  permissions: {
    admin: boolean;
    push: boolean;
    pull: boolean;
  };
}

interface GithubCommitSummary {
  sha: string;
  url: string;
  html_url: string;
}

interface GithubCommit extends GithubCommitSummary {
  parents: GithubCommitSummary[];
  commit: {
    url: string;
    comment_count: number;
    author: {
      name: string;
      email: string;
      date: string;
    };
    committer: {
      name: string;
      email: string;
      date: string;
    };
    message: string;
    tree: {
      sha: string;
      url: string;
    };
  };
}

function authenticateForUser(userToken: string) {
  API.authenticate({
    type: "oauth",
    token: userToken
  });
}

function authenticateBackend() {
  API.authenticate({
    type: "oauth",
    key: ENV.oauth.github.id,
    secret: ENV.oauth.github.secret
  });
}

function authenticateBot() {
  API.authenticate({
    type: "token",
    token: ENV.github.botToken
  });
}

export function toRepo(github: GithubRepo, attrs: Partial<Repo> = {}): Repo {
  return new Repo({
    source: "github",
    name: github.full_name.replace("/", "~"),
    url: github.html_url,
    ...attrs
  });
}

export function toCommits(
  github: GithubCommit[],
  attrs: Partial<RepoCommit> = {}
): RepoCommit[] {
  const commits = [] as RepoCommit[];
  for (const element of github) {
    for (const parent of element.parents) {
      commits.push(
        new RepoCommit({
          ref: element.sha,
          parent: parent.sha,
          ...attrs
        })
      );
    }
  }
  return commits;
}

export function fetchUserRepos(
  userToken: string
): Promise<Response<GithubRepo[]>> {
  authenticateForUser(userToken);
  return API.repos.getAll({
    sort: "updated",
    per_page: MAX_PER_PAGE
  });
}

export function fetchUserRepo(
  userToken: string,
  name: string
): Promise<Response<GithubRepo>> {
  const [owner, repo] = name.split("~");
  API.authenticate({ type: "oauth", token: userToken });
  return API.repos.get({ owner, repo });
}

export function fetchCommits(
  name: string,
  sha?: string
): Promise<Response<GithubCommit[]>> {
  const [owner, repo] = name.split("~");
  authenticateBackend();
  if (sha) {
    return API.repos.getCommits({ owner, repo, sha, per_page: MAX_PER_PAGE });
  } else {
    return API.repos.getCommits({ owner, repo, per_page: MAX_PER_PAGE });
  }
}

export function postComment(name: string, issueNumber: number, body: string) {
  const [owner, repo] = name.split("~");
  authenticateBot();
  return API.issues.createComment({
    owner,
    repo,
    number: issueNumber,
    body
  });
}
