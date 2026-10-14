const { DataTypes } = require('sequelize')
const db = require('../db/conn')

const Usuario = db.define('usuario',{
    codUsuario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nome: {
        type: DataTypes.STRING(40),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(40),
        allowNull: false
    },
    // senha criptografada (crypto-js) - o texto cifrado é maior que 40 caracteres
    senha: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    // cpf criptografado (crypto-js)
    cpf: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    telefone: {
        type: DataTypes.STRING(20),
        allowNull: false
    }
},{
    timestamps: false,
    tableName: 'usuarios'
})

module.exports = Usuario
