const desafioService = require('../services/desafioService')

async function listar(req, res, next) {
  try {
    const { categoriaId, dificuldade } = req.query
    res.json(await desafioService.listar({ categoriaId, dificuldade }))
  } catch (err) { next(err) }
}

async function buscarPorId(req, res, next) {
  try {
    const desafio = await desafioService.buscarPorId(req.params.id)
    if (!desafio) return res.status(404).json({ erro: 'Desafio não encontrado.' })
    res.json(desafio)
  } catch (err) { next(err) }
}

function validarPayload(body) {
  const { titulo, descricao, instrucoes, categoriaId } = body
  if (!titulo?.trim() || !descricao?.trim() || !instrucoes?.trim() || !categoriaId) {
    return 'Título, descrição, instruções e categoria são obrigatórios.'
  }
  return null
}

async function criar(req, res, next) {
  try {
    const erro = validarPayload(req.body)
    if (erro) return res.status(400).json({ erro })
    const desafio = await desafioService.criar({ ...req.body, autorId: req.usuario.id })
    res.status(201).json(desafio)
  } catch (err) { next(err) }
}

async function atualizar(req, res, next) {
  try {
    const erro = validarPayload(req.body)
    if (erro) return res.status(400).json({ erro })
    const existente = await desafioService.buscarPorId(req.params.id)
    if (!existente) return res.status(404).json({ erro: 'Desafio não encontrado.' })
    res.json(await desafioService.atualizar(req.params.id, req.body))
  } catch (err) { next(err) }
}

async function excluir(req, res, next) {
  try {
    const excluiu = await desafioService.excluir(req.params.id)
    if (!excluiu) return res.status(404).json({ erro: 'Desafio não encontrado.' })
    res.status(204).send()
  } catch (err) { next(err) }
}

/** POST /api/desafios/:id/participar — usuário autenticado inicia participação. */
async function participar(req, res, next) {
  try {
    const desafio = await desafioService.buscarPorId(req.params.id)
    if (!desafio) return res.status(404).json({ erro: 'Desafio não encontrado.' })

    const participacao = await desafioService.participar(req.usuario.id, req.params.id)
    res.status(201).json(participacao)
  } catch (err) { next(err) }
}

/** POST /api/desafios/:id/concluir — marca a participação como concluída. */
async function concluir(req, res, next) {
  try {
    const participacaoExistente = await desafioService.buscarParticipacao(req.usuario.id, req.params.id)
    if (!participacaoExistente) {
      return res.status(400).json({ erro: 'Você ainda não iniciou este desafio.' })
    }
    const participacao = await desafioService.concluir(req.usuario.id, req.params.id)
    res.json(participacao)
  } catch (err) { next(err) }
}

/** GET /api/desafios/:id/participacao — status da participação do usuário autenticado. */
async function minhaParticipacao(req, res, next) {
  try {
    const participacao = await desafioService.buscarParticipacao(req.usuario.id, req.params.id)
    res.json(participacao) // pode ser null — o frontend trata como "ainda não participei"
  } catch (err) { next(err) }
}

module.exports = { listar, buscarPorId, criar, atualizar, excluir, participar, concluir, minhaParticipacao }
