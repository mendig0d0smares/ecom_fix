const CryptoJS = require('crypto-js')

// Em produção, defina CRYPTO_SECRET e JWT_SECRET como variáveis de ambiente
const SECRET = process.env.lowkey || 'footwear-express-chave-aes-dev'

const criptografar = (texto)=>{
    return CryptoJS.AES.encrypt(String(texto), SECRET).toString()
}

const descriptografar = (cifrado)=>{
    const bytes = CryptoJS.AES.decrypt(cifrado, SECRET)
    return bytes.toString(CryptoJS.enc.Utf8)
}

// Mantém só os dígitos do CPF
const limparCpf = (cpf)=> String(cpf).replace(/\D/g, '')

// Resposta segura: nunca devolve a senha e mascara o CPF (LGPD)
const usuarioSeguro = (usuario)=>{
    const u = usuario.toJSON ? usuario.toJSON() : { ...usuario }
    delete u.senha
    try{
        const cpf = descriptografar(u.cpf)
        u.cpf = `***.***.***-${cpf.slice(-2)}`
    }catch(err){
        u.cpf = '***.***.***-**'
    }
    return u
}

module.exports = { criptografar, descriptografar, limparCpf, usuarioSeguro }
