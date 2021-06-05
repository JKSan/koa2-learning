const Koa = require('koa2')
const cors = require('koa2-cors')
const path = require('path')
const koa_static = require('koa-static')
const jwt = require('jsonwebtoken')
const router = require('./router/index')
const error_handler = require('./utils/error-handler')

const app = new Koa()
const port = 3000

app.use(cors())

app.use(koa_static(path.join(`${__dirname}/public`)))

app.use(async (ctx, next) => {
  await next()
  if (parseInt(ctx.status) === 404) {
    ctx.response.redirect("/404")
  }
})

app.use(router.routes(), router.allowedMethods())

error_handler(app)

app.listen(port, () => {
  console.log(`app started at port ${port}...`)
})
