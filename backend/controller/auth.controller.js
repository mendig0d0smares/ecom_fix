const jwt = require('jsonwebtoken')
const Usuario = require('../models/Usuario')
const { descriptografar, usuarioSeguro } = require('../utils/crypto')

const JWT_SECRET = process.env.JWT_SECRET || 'footwear-express-jwt-dev'
const EXPIRACAO = '90m' // 1,5 horas

const login = async (req,res)=>{
    const { email, senha } = req.body

    if(!email || !senha){
        return res.status(400).json({message: 'E-mail e senha são obrigatórios!'})
    }

    try{
        const usuario = await Usuario.findOne({where: { email: email }})

        // mesma mensagem para e-mail inexistente e senha incorreta
        if(!usuario || descriptografar(usuario.senha) !== senha){
            return res.status(401).json({message: 'E-mail ou senha inválidos!'})
        }

        const token = jwt.sign(
            { codUsuario: usuario.codUsuario, email: usuario.email },
            JWT_SECRET,
            { expiresIn: EXPIRACAO }
        )

        res.status(200).json({
            message: 'Login realizado com sucesso!',
            token: token,
            expiraEm: EXPIRACAO,
            usuario: usuarioSeguro(usuario)
        })
    }catch(err){
        console.error('Erro ao realizar o login',err)
        res.status(500).json({message: 'Erro ao realizar o login'})
    }
}

module.exports = { login }
