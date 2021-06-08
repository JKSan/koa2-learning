const md5 = require('md5')
const Result = require('../utils/result')
const model = require('../models/user')

async function userLogin (type, userName, userPassword) {
  let res = new Result()

  const u = await model.findOne({
    where: { tel: userName }
  })

  if (!u) {
    res.setError(201, '用户不存在')
    return res
  }

  // 比较密码是否一致
  try {
    if (md5(userPassword) !== u.password) {
      res.setError(202, '密码不正确')
      return res
    }
  } catch (error) {
    res.setError(203, '比较加密密码时执行出错!')
    return res
  }

  // 生成 token
  // let token = getToken({ _id: u.UserID, name: u.tel, password: u.password })
  let token = ''
  userPassword = md5(userPassword)
  res.data = { token, user: u, myself: user }
  return res
}

async function sendSmsCode (type, mobilePhone) {
  let res = new Result()
  return res
}

module.exports = {
  userLogin: (type, userName, userPassword) => userLogin(type, userName, userPassword),
  sendSmsCode: (type, mobilePhone) => sendSmsCode(type, mobilePhone)
}
