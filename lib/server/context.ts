import { Context as KoaContext } from 'koa'
import { Connection } from 'typeorm'
import HttpStatus from './http-status'
import { Renderer } from './render'
import { User } from 'lib/entity'

// TODO: investigate directly injecting the Koa Context
interface Context extends KoaContext {
  status: HttpStatus
  conn: Connection
  renderJson: Renderer
  user: User
}

export default Context
