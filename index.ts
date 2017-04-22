import * as Koa from 'koa'

const PORT = Number(process.env.PORT || 12345)

new Koa()
  .use((ctx) => {
    ctx.body = 'Hello world'
  })
  .listen(PORT)
