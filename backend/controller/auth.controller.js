const Ciclista = require('../models/Ciclista')

const cryptoJs = require('crypto-js')
const CHAVE_SECRETA = 'segredo' // deve ficar no arquivo .env

const login = async(req,res) =>{
    const valores = req.body

    if(!valores.email || !valores.senha){
        return res.status(400).json({message: "Campos email e senha obrigatórios!"})
    }

    try{
        const ciclista = await Ciclista.findOne({where: { email: valores.email}})

        if(!ciclista){
            return res.status(404).json({message: 'Ciclista não encontrado!'})
        }

        const bytes = cryptoJs.AES.decrypt(ciclista.senha, CHAVE_SECRETA)
        const senha = bytes.toString(cryptoJs.enc.Utf8)

        if(valores.senha !== senha){
            return res.status(401).json({message: 'Senha incorreta, não autorizado!'})
        }

        const tresHorasEmMs = 3 * 60 * 60 * 1000
        const tempoExpirar = Date.now() + tresHorasEmMs

        const payload = {
            idCiclista: ciclista.codCiclista,
            nome: ciclista.nome,
            expiraEm: tempoExpirar
        }

        const token = cryptoJs.AES.encrypt(JSON.stringify(payload), CHAVE_SECRETA).toString()

        return res.status(200).json({
            message: 'Login realizado com sucesso',
            nome: ciclista.nome,
            token: token
        })

    }catch(err){
        console.error('Não foi possível fazer o login!',err)
        res.status(500).json({message: 'Não foi possível fazer o login!'})
    }
}
module.exports = { login }