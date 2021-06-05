const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')
const user = require('../models/User')
const home = new Router()

home.use(bodyParser())

home.get('/', async ctx => {
  let users = await user.findAll()
  ctx.body = users
})

home.post('/banner', async ctx => {
  ctx.body = 'banner'
})

module.exports = home
