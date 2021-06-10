const md5 = require('md5')
const jwt = require('jsonwebtoken')
const { jwtSecret, expiresIn } = require('../config')
const Result = require('../utils/result')
const sms = require('../utils/sms')
const Error_Code_Message = require('../utils/error-code-message')
const model = require('../models/user')
const errorCodeMessage = require('../utils/error-code-message')


async function userLogin (payload) {
  let res = new Result()

  const { type, tel, userPassword, smsCode } = payload
  const u = await model.findOne({
    where: { tel }
  })

  if (!u) {
    type === 'password'
      ? res.setError(201, Error_Code_Message[201])
      : res.setError(204, Error_Code_Message[204])
    return res
  }

  // 比较密码/验证码是否一致
  if (type === 'password') {
    try {
      if (md5(userPassword) !== u.password) {
        res.setError(202, Error_Code_Message[202])
        return res
      }
    } catch (error) {
      res.setError(203, Error_Code_Message[203])
      return res
    }
  } else {
    let isValid = sms.verify(tel, +smsCode)
    if (!isValid) {
      res.setError(205, Error_Code_Message[205])
      return res
    }
  }

  // 生成 token
  let token = jwt.sign(
    { _id: u.userID, name: u.tel, password: u.password },
    jwtSecret,
    { expiresIn: expiresIn }
  )
  res.setSuccess('登录成功', { token, user: u })
  return res
}

async function sendSmsCode (type, mobilePhone) {
  let res = new Result()

  const u = await model.findOne({
    where: { tel: mobilePhone }
  })

  if (!u && type !== 'register') {
    res.setError(204, Error_Code_Message[204])
    return res
  }

  const typeOfTemplate = {
    login: 'LOGIN_TEMPLATE',
    register: 'REGISTER_TEMPLATE',
    reset: 'FORGETPASSS_TEMPLATE'
  }
  let templateCode = sms.templateCode[typeOfTemplate[type]]

  await sms.send(mobilePhone, templateCode)
    .then(resCode => {
      res.setSuccess('短信发送成功', resCode)
    }, ex => {
      res.setError(206, Error_Code_Message[206])
    })

  return res
}

async function register (user) {
  let res = new Result()

  let isCodeRight = sms.verify(user.tel, +user.smsCode)
  if (isCodeRight) {
    const u = await model.findOne({
      where: { tel: user.tel }
    })

    if (u) {
      res.setError(207, errorCodeMessage[207])
      return res
    }

    // 将数据插入到数据库中
    // 加密密码
    try {
      let md5Pwd = await md5(user.password)
      user.password = md5Pwd
    } catch (error) {
      res.setError(203, errorCodeMessage[203])
      return res
    }

    user.userID = 0 // 此处为默认值，前台没有传该值
    user.receiveTime = '' // 此处为默认值，前台没有传该值
    user.smsCode = '' // 此处为默认值，前台没有传该值
    let userNew = await model.create(user) // create 会返回插入到数据库后的doc对象,也即是会有UserID

    res.setSuccess('', userNew && userNew.userID > 0)
    return res
  } else {
    res.setError(205, errorCodeMessage[205])
    return res
  }
}

async function reset (user) {
  let res = new Result()

  // 验证验证码是否正确
  let isCodeRight = sms.verify(user.tel, +user.smsCode)
  if (isCodeRight) {
    const u = await model.findOne({
      where: { tel: user.tel }
    })

    if (!u) {
      res.setError(204, Error_Code_Message[204])
      return res
    }

    // 加密密码
    try {
      let md5Pwd = await md5(user.password)
      user.password = md5Pwd
    } catch (error) {
      res.setError(203, errorCodeMessage[203])
      return res
    }

    // 更新数据
    const data = await model.update({ password: user.password }, { where: { tel: user.tel } })
    res.setSuccess('重置成功', data)
    return res
  } else {
    res.setError(205, errorCodeMessage[205])
    return res
  }
}

async function update (user) {
  let count = await model.update(user, { where: { userID: user.userID } })
  res.setSuccess('更新成功', count > 0)
  return res
}

module.exports = {
  userLogin: payload => userLogin(payload),
  sendSmsCode: (type, mobilePhone) => sendSmsCode(type, mobilePhone),
  register: user => register(user),
  reset: user => reset(user),
  update: user => update(user)
}
