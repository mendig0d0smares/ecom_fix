const Usuario = require('../models/Usuario')
const { criptografar, limparCpf, usuarioSeguro } = require('../utils/crypto')

const cadastrar = async (req, res)=>{
    const valores = req.body

    if(!valores.nome || !valores.email || !valores.senha || !valores.cpf || !valores.telefone){
        return res.status(400).json({message: 'Todos os campos são obrigatórios!'})
    }

    const cpf = limparCpf(valores.cpf)
    if(cpf.length !== 11){
        return res.status(400).json({message: 'CPF inválido! Informe 11 dígitos.'})
    }

    try{
        await Usuario.create({
            nome: valores.nome,
            email: valores.email,
            senha: criptografar(valores.senha),
            cpf: criptografar(cpf),
            telefone: valores.telefone
        })
        res.status(201).json({message: 'Usuario Cadastrado com sucesso!'})
    }catch(err){
        console.error('Não foi possível cadastrar o Usuário',err)
        res.status(500).json({message: 'Não foi possível cadastrar o Usuário'})
    }
}
const listar = async (req,res)=>{
    try{
        const dados = await Usuario.findAll()
        res.status(200).json(dados.map(usuarioSeguro))
    }catch(err){
        console.error('Não foi possível listar os Usuários',err)
        res.status(500).json({message: 'Não foi possível listar os Usuários'})
    }
}
const buscarPorCod = async (req,res)=>{
    const id = req.params.id
    try{
        const dados = await Usuario.findByPk(id)
        if(!dados){
            res.status(404).json({message: 'Usuário não encontrado!'})
        }else{
            res.status(200).json(usuarioSeguro(dados))
        }
    }catch(err){
        console.error('Não foi possível encontrar o Usuário',err)
        res.status(500).json({message: 'Não foi possível encontrar o Usuário'})
    }
}
const buscarPorNome = async (req,res)=>{
    const nome = req.params.nome
    try{
        const dados = await Usuario.findOne({where: { nome: nome}})
        if(!dados){
            res.status(404).json({message: 'Nome do Usuário não encontrado!'})
        }else{
            res.status(200).json(usuarioSeguro(dados))
        }
    }catch(err){
        console.error('Não foi possível encontrar o nome do Usuário',err)
        res.status(500).json({message: 'Não foi possível encontrar o nome do Usuário'})
    }
}
const excluir = async (req,res)=>{
    const id = req.params.id
    try{
        const dados = await Usuario.findByPk(id)
        if(!dados){
            res.status(404).json({message: 'Usuário não encontrado no banco de dados!'})
        }else{
            await Usuario.destroy({where: { codUsuario: id}})
            res.status(200).json({message: 'Usuário excluído com sucesso!'})
        }
    }catch(err){
        console.error('Não foi possível excluir o Usuário',err)
        res.status(500).json({message: 'Não foi possível excluir o Usuário'})
    }
}
const atualizar = async (req,res)=>{
    const id = req.params.id
    const valores = {}

    // ignora campos vazios para não sobrescrever dados existentes
    for(const campo of ['nome','email','senha','cpf','telefone']){
        if(req.body[campo]) valores[campo] = req.body[campo]
    }

    try{
        let dados = await Usuario.findByPk(id)
        if(!dados){
            return res.status(404).json({message: 'Usuário não encontrado no banco de dados!'})
        }

        // criptografa antes de gravar
        if(valores.senha){
            valores.senha = criptografar(valores.senha)
        }
        if(valores.cpf){
            const cpf = limparCpf(valores.cpf)
            if(cpf.length !== 11){
                return res.status(400).json({message: 'CPF inválido! Informe 11 dígitos.'})
            }
            valores.cpf = criptografar(cpf)
        }

        await Usuario.update(valores, { where: { codUsuario: id}})
        dados = await Usuario.findByPk(id)
        res.status(200).json(usuarioSeguro(dados))
    }catch(err){
        console.error('Não foi possível atualizar o Usuário',err)
        res.status(500).json({message: 'Não foi possível atualizar o Usuário'})
    }
}
module.exports = { cadastrar, listar, buscarPorCod, buscarPorNome, excluir, atualizar}
