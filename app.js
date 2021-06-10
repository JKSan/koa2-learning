const Koa = require('koa2')
const cors = require('koa2-cors')
const path = require('path')
const koa_static = require('koa-static')
const koa_jwt = require('koa-jwt')
const jwt_auth = require('./middlewares/jwt-auth')
const logger = require('./middlewares/log')
const koa_jsonp = require('koa-jsonp')
const { appPort, jwtSecret } = require('./config')
const router = require('./router/index')

const app = new Koa()

app.use(logger)

app.use(koa_jwt({ secret: jwtSecret }).unless({
  path: [/^\/auth\//]
}))

app.use(jwt_auth)

app.use(koa_jsonp())

app.use(cors())

app.use(koa_static(path.join(`${__dirname}/public`)))

app.use(router.routes(), router.allowedMethods())

app.listen(appPort, () => {
  console.log(`app started at port ${appPort}...`)
})
