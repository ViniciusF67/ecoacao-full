const categoriaService = require('../services/categoriaService')

async function listar(req, res, next) {
  try {
    res.json(await categoriaService.listar())
  } catch (err) { next(err) }
}

async function buscarPorId(req, res, next) {
  try {
    const categoria = await categoriaService.buscarPorId(req.params.id)
    if (!categoria) return res.status(404).json({ erro: 'Categoria não encontrada.' })
    res.json(categoria)
  } catch (err) { next(err) }
}

async function criar(req, res, next) {
  try {
    const { nome, descricao } = req.body
    if (!nome?.trim()) return res.status(400).json({ erro: 'O nome da categoria é obrigatório.' })
    const categoria = await categoriaService.criar({ nome: nome.trim(), descricao })
    res.status(201).json(categoria)
  } catch (err) { next(err) }
}

async function atualizar(req, res, next) {
  try {
    const { nome, descricao } = req.body
    if (!nome?.trim()) return res.status(400).json({ erro: 'O nome da categoria é obrigatório.' })
    const categoria = await categoriaService.atualizar(req.params.id, { nome: nome.trim(), descricao })
    if (!categoria) return res.status(404).json({ erro: 'Categoria não encontrada.' })
    res.json(categoria)
  } catch (err) { next(err) }
}

async function excluir(req, res, next) {
  try {
    const excluiu = await categoriaService.excluir(req.params.id)
    if (!excluiu) return res.status(404).json({ erro: 'Categoria não encontrada.' })
    res.status(204).send()
  } catch (err) { next(err) }
}

module.exports = { listar, buscarPorId, criar, atualizar, excluir }
