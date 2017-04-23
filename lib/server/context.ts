import { Connection } from 'typeorm'
import { IRouterContext } from 'koa-router'
import HttpStatus from './http-status'

interface Context extends IRouterContext {
  status: HttpStatus
  conn: Connection
}

export default Context
