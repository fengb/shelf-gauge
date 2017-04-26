import { Profile, Strategy, StrategyOption } from 'passport-github'

import { connect } from '../connection'
import { User } from 'lib/entity'

const OPTIONS: StrategyOption = {
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.GITHUB_CLIENT_CALLBACK
}

export async function verify (accessToken: string, refreshToken: string, profile: Profile): Promise<any> {
  const connection = await connect()
  const user = await connection.entityManager.findOne(User, { githubId: profile.id })
               || connection.entityManager.create(User, { githubId: profile.id })

  if (profile.username && profile.username !== user.username) {
    user.username = profile.username
    await connection.entityManager.persist(user)
  }

  return user
}

export function verifyCb (accessToken: string, refreshToken: string, profile: Profile, done: (error: any, user?: any) => void) {
  verify(accessToken, refreshToken, profile)
  .asCallback(done)
}

export default function (): Strategy {
  return new Strategy(OPTIONS, verifyCb)
}
