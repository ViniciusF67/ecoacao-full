const quizService = require('../services/quizService')

async function listar(req, res, next) {
  try {
    res.json(await quizService.listar({ categoriaId: req.query.categoriaId }))
  } catch (err) { next(err) }
}

async function buscarParaResponder(req, res, next) {
  try {
    const quiz = await quizService.buscarParaResponder(req.params.id)
    if (!quiz) return res.status(404).json({ erro: 'Quiz não encontrado.' })
    res.json(quiz)
  } catch (err) { next(err) }
}

/** POST /api/quizzes/:id/responder — calcula o resultado no backend. */
async function responder(req, res, next) {
  try {
    const { respostas } = req.body
    if (!Array.isArray(respostas) || respostas.length === 0) {
      return res.status(400).json({ erro: 'Envie ao menos uma resposta no formato [{ perguntaId, alternativaId }].' })
    }

    const quiz = await quizService.buscarParaResponder(req.params.id)
    if (!quiz) return res.status(404).json({ erro: 'Quiz não encontrado.' })

    const resultado = await quizService.responder(req.params.id, req.usuario.id, respostas)
    res.json(resultado)
  } catch (err) { next(err) }
}

function validarCriacao(body) {
  const { titulo, categoriaId, perguntas } = body
  if (!titulo?.trim() || !categoriaId) return 'Título e categoria são obrigatórios.'
  if (!Array.isArray(perguntas) || perguntas.length === 0) return 'O quiz precisa de ao menos uma pergunta.'

  for (const p of perguntas) {
    if (!p.enunciado?.trim()) return 'Toda pergunta precisa de um enunciado.'
    if (!Array.isArray(p.alternativas) || p.alternativas.length < 2) {
      return 'Toda pergunta precisa de ao menos duas alternativas.'
    }
    if (!p.alternativas.some((a) => a.correta)) {
      return `A pergunta "${p.enunciado}" precisa ter uma alternativa marcada como correta.`
    }
  }
  return null
}

async function criar(req, res, next) {
  try {
    const erro = validarCriacao(req.body)
    if (erro) return res.status(400).json({ erro })

    const quiz = await quizService.criar({ ...req.body, autorId: req.usuario.id })
    res.status(201).json(quiz)
  } catch (err) { next(err) }
}

async function excluir(req, res, next) {
  try {
    const excluiu = await quizService.excluir(req.params.id)
    if (!excluiu) return res.status(404).json({ erro: 'Quiz não encontrado.' })
    res.status(204).send()
  } catch (err) { next(err) }
}

/** GET /api/quizzes/historico/me — resultados do usuário autenticado. */
async function meuHistorico(req, res, next) {
  try {
    res.json(await quizService.historicoDoUsuario(req.usuario.id))
  } catch (err) { next(err) }
}

module.exports = { listar, buscarParaResponder, responder, criar, excluir, meuHistorico }
