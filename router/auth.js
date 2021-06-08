const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')
const authController = require('../controllers/auth')
const auth = new Router()

auth.use(bodyParser())

auth.get('/login', async ctx => {
  const { type, userName, userPassword } = ctx.query
  ctx.body = await authController.userLogin(type, userName, userPassword)
})

auth.get('/sendSmsCode', async ctx => {
  const { type, mobilePhone } = ctx.query
  ctx.body = await authController.sendSmsCode(type, mobilePhone)
})

module.exports = auth
