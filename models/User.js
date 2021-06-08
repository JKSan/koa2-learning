const dayjs = require('dayjs')
const { defineModel, DataTypes } = require('../utils/db')

let user = defineModel('jd_user', {
  userID: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  userName: {
    type: DataTypes.STRING(20),
    defaultValue: ''
  },
  password: DataTypes.STRING(50),
  email: {
    type: DataTypes.STRING(64),
    defaultValue: ''
  },
  tel: DataTypes.CHAR(14),
  onLine: {
    type: DataTypes.TINYINT,
    defaultValue: 0
  },
  activated: {
    type: DataTypes.TINYINT,
    defaultValue: 0
  },
  smsCode: {
    type: DataTypes.STRING(10),
    defaultValue: ''
  },
  receiveTime: {
    type: DataTypes.DATE,
    set (val) {
      val
        ? this.setDataValue('receiveTime', val)
        : this.setDataValue('receiveTime', '2000/01/01 00:00:00')
    },
    get () {
      return dayjs(this.getDataValue('receiveTime')).format('YYYY-MM-DD HH:mm:ss')
    }
  }
})

module.exports = user
