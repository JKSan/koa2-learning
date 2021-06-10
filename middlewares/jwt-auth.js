const jwt = require('jsonwebtoken')
const { jwtSecret } = require('../config')

module.exports = async (ctx, next) => {
  // 获取生成token时的过期时间,判断是否在允许过期延迟时间范围内，如果是则重新生成token返回，否则报错
  let payload = {}
  if (ctx.header.authorization) {
    // 防止token前缀不符
    if (ctx.header.authorization.indexOf('Bearer ') === -1) {
      ctx.throw(401, 'Bad Authorization header format. Format is "Authorization: Bearer"')
    }

    try {
      payload = await jwt.verify(ctx.header.authorization.split(' ')[1], jwtSecret)
    } catch (err) {
      console.log(err.message, new Date(err.expiredAt).getTime())
      if (err.message === 'jwt expired') {
        payload.exp = parseInt(new Date(err.expiredAt).getTime() / 1000)
      } else {
        throw err
      }
    }

    if (payload && payload.exp) {
      let allowTime = parseInt(new Date().getTime() / 1000) - parseInt(payload.exp)
      if ((allowTime > -1 && allowTime <= 600) || (allowTime < 0)) {
        await next()
      } else {
        ctx.throw(401, 'Bad Authorization header format. Format is "Authorization: Bearer"')
      }
    } else {
      ctx.throw(401, 'Bad Authorization header format. Format is "Authorization: Bearer"')
    }
  } else {
    await next()
  }
}
