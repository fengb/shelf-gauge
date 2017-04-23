import { Connection } from 'typeorm'
import { IRouterContext } from 'koa-router'

interface Context extends IRouterContext {
  conn: Connection
}

export default Context
