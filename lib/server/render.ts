import Context from './context'
import HttpStatus from './http-status'

export type Json = Object
export type Renderer = (status: HttpStatus, body?: Json) => void

export class RenderComplete {}

function renderJson (this: Context, status: HttpStatus, body?: Json) {
  this.status = status
  this.body = body || {}
  // TODO: better way to terminate the stack
  throw new RenderComplete
}

export default async function (ctx: Context, next: () => Promise<any>) {
  ctx.renderJson = renderJson.bind(ctx)
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
