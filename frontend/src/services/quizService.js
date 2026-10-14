import { api } from './api.js'

export async function listarQuizzes({ categoriaId } = {}) {
  const query = categoriaId ? `?categoriaId=${categoriaId}` : ''
  return api(`/quizzes${query}`)
}

/** Busca o quiz para responder — vem SEM indicar qual alternativa é correta. */
export async function buscarQuizParaResponder(id) {
  return api(`/quizzes/${id}`)
}

/**
 * Envia as respostas do usuário. O backend calcula o resultado comparando
 * com o gabarito no banco — o frontend nunca envia a pontuação pronta.
 * respostas: [{ perguntaId, alternativaId }]
 */
export async function responderQuiz(id, respostas) {
  return api(`/quizzes/${id}/responder`, { method: 'POST', body: { respostas }, autenticado: true })
}

export async function criarQuiz(dados) {
  return api('/quizzes', { method: 'POST', body: dados, autenticado: true })
}

export async function excluirQuiz(id) {
  return api(`/quizzes/${id}`, { method: 'DELETE', autenticado: true })
}

export async function meuHistoricoDeQuizzes() {
  return api('/quizzes/historico/me', { autenticado: true })
}
