const Router = require('koa-router')
const error_page = require('./error-page')
const auth = require('./auth')

const router = new Router()

router.use('/auth', auth.routes(), auth.allowedMethods())
router.use(error_page.routes(), error_page.allowedMethods())

router.redirect('/', '/auth')

module.exports = router
