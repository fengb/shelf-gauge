import Repo from "./repo";
import RepoCommit from "./repo-commit";
import RepoAuth from "./repo-auth";
import Suite from "./suite";
import SuiteEnv from "./suite-env";
import SuiteTest from "./suite-test";
import User from "./user";

export { Repo, RepoCommit, RepoAuth, Suite, SuiteEnv, SuiteTest, User };
export type Entity =
  | Repo
  | RepoCommit
  | RepoAuth
  | Suite
  | SuiteEnv
  | SuiteTest
  | User;
export const Entities: Array<new () => Entity> = [
  Repo,
  RepoCommit,
  RepoAuth,
  Suite,
  SuiteEnv,
  SuiteTest,
  User
];
