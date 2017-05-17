import Repo from './repo'
import RepoCommit from './repo-commit'
import RepoSecret from './repo-secret'
import Suite from './suite'
import SuiteEnv from './suite-env'
import SuiteTest from './suite-test'
import User from './user'

export { Repo, RepoCommit, RepoSecret, Suite, SuiteEnv, SuiteTest, User }
export type Entity = Repo | RepoCommit | RepoSecret | Suite | SuiteEnv | SuiteTest | User
export const Entities: Array<new () => Entity> = [Repo, RepoCommit, RepoSecret, Suite, SuiteEnv, SuiteTest, User]
