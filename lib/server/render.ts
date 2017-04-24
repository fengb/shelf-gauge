import Context from './context'
import HttpStatus from './http-status'

export type Json = Object
export type Renderer = (HttpStatus, Json?) => void

export class RenderComplete {}

function renderJson (status: HttpStatus, body?: Json) {
  this.status = status
  this.body = body || {}
  // TODO: better way to terminate the stack
  throw new RenderComplete
}

export default async function (ctx: Context, next) {
  ctx.renderJson = renderJson
  // TODO: better way to terminate the stack
  try {
    await next()
  } catch (err) {
    if (err instanceof RenderComplete) {
      // Success!
      return
    }

    throw err
  }
}
