const Router = require('koa-router')
const error_page = require('./error-page')
const home = require('./home')

const router = new Router()

router.use('/home', home.routes(), home.allowedMethods())
router.use(error_page.routes(), error_page.allowedMethods())

router.redirect('/', '/home')

module.exports = router
