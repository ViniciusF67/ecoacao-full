const conteudoService = require('../services/conteudoService')

async function listar(req, res, next) {
  try {
    const { categoriaId, busca } = req.query
    res.json(await conteudoService.listar({ categoriaId, busca }))
  } catch (err) { next(err) }
}

async function buscarPorId(req, res, next) {
  try {
    const conteudo = await conteudoService.buscarPorId(req.params.id)
    if (!conteudo) return res.status(404).json({ erro: 'Conteúdo não encontrado.' })
    res.json(conteudo)
  } catch (err) { next(err) }
}

function validarPayload(body) {
  const { titulo, descricao, conteudo, categoriaId } = body
  if (!titulo?.trim() || !descricao?.trim() || !conteudo?.trim() || !categoriaId) {
    return 'Título, descrição, conteúdo e categoria são obrigatórios.'
  }
  return null
}

async function criar(req, res, next) {
  try {
    const erro = validarPayload(req.body)
    if (erro) return res.status(400).json({ erro })

    const conteudo = await conteudoService.criar({ ...req.body, autorId: req.usuario.id })
    res.status(201).json(conteudo)
  } catch (err) { next(err) }
}

async function atualizar(req, res, next) {
  try {
    const erro = validarPayload(req.body)
    if (erro) return res.status(400).json({ erro })

    const existente = await conteudoService.buscarPorId(req.params.id)
    if (!existente) return res.status(404).json({ erro: 'Conteúdo não encontrado.' })

    const atualizado = await conteudoService.atualizar(req.params.id, req.body)
    res.json(atualizado)
  } catch (err) { next(err) }
}

async function excluir(req, res, next) {
  try {
    const excluiu = await conteudoService.excluir(req.params.id)
    if (!excluiu) return res.status(404).json({ erro: 'Conteúdo não encontrado.' })
    res.status(204).send()
  } catch (err) { next(err) }
}

module.exports = { listar, buscarPorId, criar, atualizar, excluir }
