const Router = require('koa-router')
const error_page = new Router()

error_page.get('/404', async ctx => {
  ctx.body = '访问页面不存在'
})

module.exports = error_page
