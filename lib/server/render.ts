import { Context, Http } from '.'

type HttpSuccessName = keyof typeof Http.Success
type HttpErrorName = keyof typeof Http.Error

declare module 'koa' {
  interface Context {
    renderSuccess: (status: HttpSuccessName, obj: any) => void
    renderError: (status: HttpErrorName, obj?: any) => void
  }
}

function renderSuccess (this: Context, status: HttpSuccessName, obj: any) {
  this.status = Http.Success[status]
  this.body = { data: obj }
}

function renderError (this: Context, status: HttpErrorName, obj?: any) {
  this.status = Http.Error[status]
  this.body = { error: obj }
}

export default async function (ctx: Context, next: () => Promise<any>) {
  ctx.renderSuccess = renderSuccess.bind(ctx)
  ctx.renderError = renderError.bind(ctx)
  return next()
}
