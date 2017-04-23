import Context from './context'
import { connect } from 'lib/entity'

export default async function (ctx: Context, next) {
  const connStatus = connect()
  ctx.conn = connStatus.isFulfilled() ? connStatus.value() : await connStatus
  return next()
}
