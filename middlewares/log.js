const log4js = require('log4js')
const env = process.env.NODE_ENV

log4js.configure({
  appenders: {
    everything: {
      type: 'file',
      filename: 'logs/app.log',
      maxLogSize: 10485760,
      backups: 3,
      compress: true
    },
    dev: {
      type: 'console'
    }
  },
  categories: {
    default: {
      appenders: ['everything'],
      level: 'info'
    },
    dev: {
      appenders: ['dev', 'everything'],
      level: 'debug'
    }
  }
})

let logger = env !== 'production'
  ? log4js.getLogger('dev')
  : log4js.getLogger()

module.exports = async function (ctx, next) {
  await next()

  try {
    // 开始进入到下一个中间件
    if (ctx.status === 404) {
      ctx.throw(404);
    }

    // 大于200的自定义错误都做记录
    if (ctx.body.code > 200) {
      logger.info(JSON.stringify({
        url: ctx.url,
        message: ctx.body.message,
        timespan: Date.now()
      }))
    }
  } catch (error) {
    // 记录异常日志
    logger.info(JSON.stringify({
      url: ctx.url,
      error,
      timespan: Date.now()
    }))
  }
}
