import Context from './context'
import { connect } from 'lib/entity'

export default async function (ctx: Context, next: () => Promise<any>) {
  ctx.conn = await connect()
  return next()
}
