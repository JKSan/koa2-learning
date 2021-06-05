const { Sequelize, DataTypes } = require('sequelize')

const sequelize = new Sequelize(
  '',
  '',
  '',
  {
    host: '',
    port: 3308,
    dialect: 'mysql',
    pool: {
      max: 5,
      min: 0,
      idle: 30000
    }
  }
)

sequelize.authenticate().then(() => {
  console.log('Connection has been established successfully.')
}).catch(error => {
  console.error('Unable to connect to the database:', error)
})

function defineModel (name, fields) {
  return sequelize.define(name, fields, { tableName: name, timestamps: false })
}

module.exports = { defineModel, DataTypes }
