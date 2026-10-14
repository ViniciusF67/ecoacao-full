import { api } from './api.js'

export async function listarDesafios({ categoriaId, dificuldade } = {}) {
  const params = new URLSearchParams()
  if (categoriaId) params.set('categoriaId', categoriaId)
  if (dificuldade) params.set('dificuldade', dificuldade)
  const query = params.toString() ? `?${params.toString()}` : ''
  return api(`/desafios${query}`)
}

export async function buscarDesafio(id) {
  return api(`/desafios/${id}`)
}

export async function criarDesafio(dados) {
  return api('/desafios', { method: 'POST', body: dados, autenticado: true })
}

export async function excluirDesafio(id) {
  return api(`/desafios/${id}`, { method: 'DELETE', autenticado: true })
}

export async function minhaParticipacao(desafioId) {
  return api(`/desafios/${desafioId}/participacao`, { autenticado: true })
}

export async function participarDoDesafio(desafioId) {
  return api(`/desafios/${desafioId}/participar`, { method: 'POST', autenticado: true })
}

export async function concluirDesafio(desafioId) {
  return api(`/desafios/${desafioId}/concluir`, { method: 'POST', autenticado: true })
}
export async function atualizarDesafio(id, dados) {
  return api(`/desafios/${id}`, {
    method: 'PUT',
    body: dados,
    autenticado: true
  })
}