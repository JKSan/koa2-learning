const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')
const error_page = require('./error-page')
const oss_helper = require('./oss-helper')
const auth = require('./auth')

const router = new Router()

router.use(bodyParser())

router.use(error_page.routes(), error_page.allowedMethods())
router.use(oss_helper.routes(), oss_helper.allowedMethods())
router.use('/auth', auth.routes(), auth.allowedMethods())

router.redirect('/', '/auth')

module.exports = router
