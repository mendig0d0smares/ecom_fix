const { Sequelize } = require('sequelize')

const db = new Sequelize('ecom','root','root',{
    host: 'localhost',
    dialect: 'mysql',
    port: 3306
})

module.exports = db