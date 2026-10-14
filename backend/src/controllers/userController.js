const bcrypt = require('bcrypt')
const userService = require('../services/userService')

/* ---------- Perfil próprio ---------- */

async function meuPerfil(req, res, next) {
  try {
    const usuario = await userService.buscarPorId(req.usuario.id)
    if (!usuario) return res.status(404).json({ erro: 'Usuário não encontrado.' })
    res.json(usuario)
  } catch (err) { next(err) }
}

async function atualizarMeuPerfil(req, res, next) {
  try {
    const { nome, foto, bio } = req.body
    if (!nome?.trim()) return res.status(400).json({ erro: 'O nome é obrigatório.' })
    const usuario = await userService.atualizarPerfilProprio(req.usuario.id, { nome: nome.trim(), foto, bio })
    res.json(usuario)
  } catch (err) { next(err) }
}

async function alterarMinhaSenha(req, res, next) {
  try {
    const { senhaAtual, novaSenha } = req.body
    if (!senhaAtual || !novaSenha) {
      return res.status(400).json({ erro: 'Informe a senha atual e a nova senha.' })
    }
    if (novaSenha.length < 6) {
      return res.status(400).json({ erro: 'A nova senha deve ter ao menos 6 caracteres.' })
    }

    const hashAtual = await userService.buscarSenhaHash(req.usuario.id)
    const senhaCorreta = await bcrypt.compare(senhaAtual, hashAtual)
    if (!senhaCorreta) {
      return res.status(401).json({ erro: 'Senha atual incorreta.' })
    }

    const novoHash = await bcrypt.hash(novaSenha, 10)
    await userService.atualizarSenhaPropria(req.usuario.id, novoHash)
    res.json({ mensagem: 'Senha alterada com sucesso.' })
  } catch (err) { next(err) }
}

/* ---------- Administração (requer users.read / users.update / users.delete) ---------- */

async function listar(req, res, next) {
  try {
    res.json(await userService.listar())
  } catch (err) { next(err) }
}

async function buscarPorId(req, res, next) {
  try {
    const usuario = await userService.buscarPorId(req.params.id)
    if (!usuario) return res.status(404).json({ erro: 'Usuário não encontrado.' })
    res.json(usuario)
  } catch (err) { next(err) }
}

async function alterarRole(req, res, next) {
  try {
    const { role } = req.body
    if (!role?.trim()) return res.status(400).json({ erro: 'Informe o papel (role) desejado.' })
    const usuario = await userService.alterarRole(req.params.id, role.trim())
    res.json(usuario)
  } catch (err) { next(err) }
}

async function alterarStatus(req, res, next) {
  try {
    const { status } = req.body
    if (!['ativo', 'inativo', 'banido'].includes(status)) {
      return res.status(400).json({ erro: 'Status inválido. Use ativo, inativo ou banido.' })
    }
    const usuario = await userService.alterarStatus(req.params.id, status)
    res.json(usuario)
  } catch (err) { next(err) }
}

async function excluir(req, res, next) {
  try {
    if (Number(req.params.id) === req.usuario.id) {
      return res.status(400).json({ erro: 'Você não pode excluir sua própria conta por aqui.' })
    }
    const excluiu = await userService.excluir(req.params.id)
    if (!excluiu) return res.status(404).json({ erro: 'Usuário não encontrado.' })
    res.status(204).send()
  } catch (err) { next(err) }
}

module.exports = {
  meuPerfil, atualizarMeuPerfil, alterarMinhaSenha,
  listar, buscarPorId, alterarRole, alterarStatus, excluir,
}
