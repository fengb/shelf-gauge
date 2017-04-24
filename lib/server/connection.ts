import Context from './context'
import { connect } from 'lib/entity'

export default async function (ctx: Context, next) {
  ctx.conn = await connect()
  return next()
}
