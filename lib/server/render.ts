import { Context, Http } from '.'
import { JsonField } from 'lib/util/serializer'

type HttpSuccessName = keyof typeof Http.Success
type HttpErrorName = keyof typeof Http.Error

declare module 'koa' {
  interface Context {
    renderSuccess: (status: HttpSuccessName, data: JsonField) => void
    renderError: (status: HttpErrorName, error?: JsonField) => void
  }
}

function renderSuccess (this: Context, status: HttpSuccessName, data: JsonField) {
  this.status = Http.Success[status]
  this.body = { data }
}

function renderError (this: Context, status: HttpErrorName, error?: JsonField) {
  this.status = Http.Error[status]
  this.body = { error }
}

export default async function (ctx: Context, next: () => Promise<any>) {
  ctx.renderSuccess = renderSuccess
  ctx.renderError = renderError
  return next()
}
