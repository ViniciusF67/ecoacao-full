import { api } from './api.js'

export async function listarNoticias({ categoriaId, busca } = {}) {
  const params = new URLSearchParams()
  if (categoriaId) params.set('categoriaId', categoriaId)
  if (busca) params.set('busca', busca)
  const query = params.toString() ? `?${params.toString()}` : ''
  return api(`/noticias${query}`)
}

export async function buscarNoticia(id) {
  return api(`/noticias/${id}`)
}

export async function criarNoticia(dados) {
  return api('/noticias', { method: 'POST', body: dados, autenticado: true })
}

export async function atualizarNoticia(id, dados) {
  return api(`/noticias/${id}`, { method: 'PUT', body: dados, autenticado: true })
}

export async function excluirNoticia(id) {
  return api(`/noticias/${id}`, { method: 'DELETE', autenticado: true })
}
