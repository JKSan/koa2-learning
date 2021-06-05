const { defineModel, DataTypes } = require('../utils/db')

let user = defineModel('', {
  title: DataTypes.STRING(50)
})

module.exports = user
