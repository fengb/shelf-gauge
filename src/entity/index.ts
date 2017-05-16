import Repo from './repo'
import RepoSecret from './repo-secret'
import Suite from './suite'
import SuiteEnv from './suite-env'
import SuiteTest from './suite-test'
import User from './user'

export { Repo, RepoSecret, Suite, SuiteEnv, SuiteTest, User }
export type Entity = Repo | RepoSecret | Suite | SuiteEnv | SuiteTest | User
export const Entities: Array<new () => Entity> = [Repo, RepoSecret, Suite, SuiteEnv, SuiteTest, User]
