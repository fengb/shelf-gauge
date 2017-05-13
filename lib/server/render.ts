import { Context } from '.'
import * as HttpStatus from 'lib/util/http-status'
import { JsonField } from 'lib/util/serializer'

type HttpSuccess = keyof typeof HttpStatus.Success
type HttpError = keyof typeof HttpStatus.Error

declare module 'koa' {
  interface Context {
    renderSuccess: (status: HttpSuccess, data: JsonField) => void
    renderError: (status: HttpError, error?: JsonField) => void
  }
}

function renderSuccess (this: Context, status: HttpSuccess, data: JsonField) {
  this.status = HttpStatus.Success[status]
  this.body = { data }
}

function renderError (this: Context, status: HttpError, error?: JsonField) {
  this.status = HttpStatus.Error[status]
  this.body = { error }
}

export default async function (ctx: Context, next: () => Promise<any>) {
  ctx.renderSuccess = renderSuccess
  ctx.renderError = renderError
  return next()
}
