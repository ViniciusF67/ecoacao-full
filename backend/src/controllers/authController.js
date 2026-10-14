const jwt = require('jsonwebtoken')
const authService = require('../services/authService')

function validarEmail(email) {
  return /^\S+@\S+\.\S+$/.test(email)
}

function gerarToken(usuario, permissoes) {
  return jwt.sign(
    {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      role: usuario.role_nome || usuario.role,
      permissions: permissoes,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  )
}

async function register(req, res, next) {
  try {
    const { nome, email, senha } = req.body

    if (!nome?.trim() || !email?.trim() || !senha) {
      return res.status(400).json({ erro: 'Nome, e-mail e senha são obrigatórios.' })
    }
    if (!validarEmail(email)) {
      return res.status(400).json({ erro: 'E-mail inválido.' })
    }
    if (senha.length < 6) {
      return res.status(400).json({ erro: 'A senha deve ter ao menos 6 caracteres.' })
    }

    const novoUsuario = await authService.criarUsuario({ nome: nome.trim(), email: email.trim(), senha })
    const permissoes = await authService.buscarPermissoesDoRole(
      (await authService.buscarUsuarioPorEmail(novoUsuario.email)).role_id
    )

    const token = gerarToken({ ...novoUsuario, role_nome: 'usuario' }, permissoes)

    res.status(201).json({
      token,
      usuario: {
        id: novoUsuario.id,
        nome: novoUsuario.nome,
        email: novoUsuario.email,
        role: 'usuario',
      },
    })
  } catch (err) {
    next(err)
  }
}

async function login(req, res, next) {
  try {
    const { email, senha } = req.body

    if (!email?.trim() || !senha) {
      return res.status(400).json({ erro: 'E-mail e senha são obrigatórios.' })
    }

    const usuario = await authService.buscarUsuarioPorEmail(email.trim())
    if (!usuario) {
      return res.status(401).json({ erro: 'E-mail ou senha incorretos.' })
    }
    if (usuario.status !== 'ativo') {
      return res.status(403).json({ erro: 'Esta conta está inativa ou bloqueada.' })
    }

    const senhaValida = await authService.verificarSenha(senha, usuario.senha_hash)
    if (!senhaValida) {
      return res.status(401).json({ erro: 'E-mail ou senha incorretos.' })
    }

    const permissoes = await authService.buscarPermissoesDoRole(usuario.role_id)
    const token = gerarToken(usuario, permissoes)

    res.json({
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        foto: usuario.foto,
        bio: usuario.bio,
        role: usuario.role_nome,
        dataCadastro: usuario.data_cadastro,
      },
    })
  } catch (err) {
    next(err)
  }
}

/** Retorna os dados do usuário autenticado (a partir do token). */
async function me(req, res, next) {
  try {
    const usuario = await authService.buscarUsuarioPorEmail(req.usuario.email)
    if (!usuario) return res.status(404).json({ erro: 'Usuário não encontrado.' })

    res.json({
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      foto: usuario.foto,
      bio: usuario.bio,
      role: usuario.role_nome,
      dataCadastro: usuario.data_cadastro,
      permissions: req.usuario.permissions,
    })
  } catch (err) {
    next(err)
  }
}

module.exports = { register, login, me }
