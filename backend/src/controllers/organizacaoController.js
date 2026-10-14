const organizacaoService = require('../services/organizacaoService')

async function listar(req, res, next) {
  try {
    const { categoriaId, busca } = req.query
    res.json(await organizacaoService.listar({ categoriaId, busca }))
  } catch (err) { next(err) }
}

async function buscarPorId(req, res, next) {
  try {
    const organizacao = await organizacaoService.buscarPorId(req.params.id)
    if (!organizacao) return res.status(404).json({ erro: 'Organização não encontrada.' })
    res.json(organizacao)
  } catch (err) { next(err) }
}

function validarPayload(body) {
  const { nome, descricao, categoriaId } = body
  if (!nome?.trim() || !descricao?.trim() || !categoriaId) {
    return 'Nome, descrição e categoria são obrigatórios.'
  }
  return null
}

async function criar(req, res, next) {
  try {
    const erro = validarPayload(req.body)
    if (erro) return res.status(400).json({ erro })
    const organizacao = await organizacaoService.criar({ ...req.body, criadoPor: req.usuario.id })
    res.status(201).json(organizacao)
  } catch (err) { next(err) }
}

async function atualizar(req, res, next) {
  try {
    const erro = validarPayload(req.body)
    if (erro) return res.status(400).json({ erro })
    const existente = await organizacaoService.buscarPorId(req.params.id)
    if (!existente) return res.status(404).json({ erro: 'Organização não encontrada.' })
    res.json(await organizacaoService.atualizar(req.params.id, req.body))
  } catch (err) { next(err) }
}

async function excluir(req, res, next) {
  try {
    const excluiu = await organizacaoService.excluir(req.params.id)
    if (!excluiu) return res.status(404).json({ erro: 'Organização não encontrada.' })
    res.status(204).send()
  } catch (err) { next(err) }
}

async function adicionarAcao(req, res, next) {
  try {
    const { titulo, descricao } = req.body
    if (!titulo?.trim() || !descricao?.trim()) {
      return res.status(400).json({ erro: 'Título e descrição da ação são obrigatórios.' })
    }
    const organizacao = await organizacaoService.buscarPorId(req.params.id)
    if (!organizacao) return res.status(404).json({ erro: 'Organização não encontrada.' })

    const acao = await organizacaoService.adicionarAcao(req.params.id, req.body)
    res.status(201).json(acao)
  } catch (err) { next(err) }
}

module.exports = { listar, buscarPorId, criar, atualizar, excluir, adicionarAcao }
