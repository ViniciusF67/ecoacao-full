const noticiaService = require('../services/noticiaService')

async function listar(req, res, next) {
  try {
    const { categoriaId, busca } = req.query
    res.json(await noticiaService.listar({ categoriaId, busca }))
  } catch (err) { next(err) }
}

async function buscarPorId(req, res, next) {
  try {
    const noticia = await noticiaService.buscarPorId(req.params.id)
    if (!noticia) return res.status(404).json({ erro: 'Notícia não encontrada.' })
    res.json(noticia)
  } catch (err) { next(err) }
}

function validarPayload(body) {
  const { titulo, resumo, conteudo, categoriaId } = body
  if (!titulo?.trim() || !resumo?.trim() || !conteudo?.trim() || !categoriaId) {
    return 'Título, resumo, conteúdo e categoria são obrigatórios.'
  }
  return null
}

async function criar(req, res, next) {
  try {
    const erro = validarPayload(req.body)
    if (erro) return res.status(400).json({ erro })

    const noticia = await noticiaService.criar({
      ...req.body,
      autorId: req.usuario.id, // autor é sempre o usuário autenticado, nunca vindo do body
    })
    res.status(201).json(noticia)
  } catch (err) { next(err) }
}

async function atualizar(req, res, next) {
  try {
    const erro = validarPayload(req.body)
    if (erro) return res.status(400).json({ erro })

    const existente = await noticiaService.buscarPorId(req.params.id)
    if (!existente) return res.status(404).json({ erro: 'Notícia não encontrada.' })

    const atualizada = await noticiaService.atualizar(req.params.id, req.body)
    res.json(atualizada)
  } catch (err) { next(err) }
}

async function excluir(req, res, next) {
  try {
    const excluiu = await noticiaService.excluir(req.params.id)
    if (!excluiu) return res.status(404).json({ erro: 'Notícia não encontrada.' })
    res.status(204).send()
  } catch (err) { next(err) }
}

module.exports = { listar, buscarPorId, criar, atualizar, excluir }
