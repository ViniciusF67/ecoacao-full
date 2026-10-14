import { api } from './api.js'

export async function listarConteudos({ categoriaId, busca } = {}) {
  const params = new URLSearchParams()
  if (categoriaId) params.set('categoriaId', categoriaId)
  if (busca) params.set('busca', busca)
  const query = params.toString() ? `?${params.toString()}` : ''
  return api(`/conteudos${query}`)
}

export async function buscarConteudo(id) {
  return api(`/conteudos/${id}`)
}

export async function criarConteudo(dados) {
  return api('/conteudos', { method: 'POST', body: dados, autenticado: true })
}

export async function atualizarConteudo(id, dados) {
  return api(`/conteudos/${id}`, { method: 'PUT', body: dados, autenticado: true })
}

export async function excluirConteudo(id) {
  return api(`/conteudos/${id}`, { method: 'DELETE', autenticado: true })
}
