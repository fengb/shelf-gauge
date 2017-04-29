import Repository from './repository'
import RepositorySecret from './repository-secret'
import Suite from './suite'
import SuiteEnv from './suite-env'
import SuiteTest from './suite-test'
import User from './user'

export { Repository, RepositorySecret, Suite, SuiteEnv, SuiteTest, User }
export const Entities: Function[] = [Repository, RepositorySecret, Suite, SuiteEnv, SuiteTest, User]
