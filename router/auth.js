const Router = require('koa-router')
const authController = require('../controllers/auth')
const auth = new Router()

auth.get('/login', async ctx => {
  ctx.body = await authController.userLogin(ctx.query)
})

auth.get('/sendSmsCode', async ctx => {
  const { type, mobilePhone } = ctx.query
  ctx.body = await authController.sendSmsCode(type, mobilePhone)
})

auth.post('/register', async ctx => {
  ctx.body = await authController.register(ctx.request.body)
})

auth.post('/reset', async ctx => {
  ctx.body = await authController.reset(ctx.request.body)
})

auth.put('/update', async ctx => {
  ctx.body = await authController.update(ctx.request.body)
})

module.exports = auth
