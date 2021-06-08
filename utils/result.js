// 定义controller返回的数据结构
const res = {
  code: 200,  // 200表示返回正常，其它表示异常
  data: null,
  message: ''
}

class Result {
  constructor(result) {
    Object.assign(this, res, result)
  }

  setSuccess (message, data) {
    Object.assign(this, { message, data })
  }

  setError (code, message) {
    Object.assign(this, { code, message })
  }
}

module.exports = Result
