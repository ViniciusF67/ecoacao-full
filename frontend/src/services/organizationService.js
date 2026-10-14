import { api } from './api.js'

export async function listarOrganizacoes({ categoriaId, busca } = {}) {
  const params = new URLSearchParams()
  if (categoriaId) params.set('categoriaId', categoriaId)
  if (busca) params.set('busca', busca)
  const query = params.toString() ? `?${params.toString()}` : ''
  return api(`/organizacoes${query}`)
}

export async function buscarOrganizacao(id) {
  return api(`/organizacoes/${id}`)
}

export async function criarOrganizacao(dados) {
  return api('/organizacoes', { method: 'POST', body: dados, autenticado: true })
}

export async function atualizarOrganizacao(id, dados) {
  return api(`/organizacoes/${id}`, { method: 'PUT', body: dados, autenticado: true })
}

export async function excluirOrganizacao(id) {
  return api(`/organizacoes/${id}`, { method: 'DELETE', autenticado: true })
}

export async function adicionarAcao(organizacaoId, dados) {
  return api(`/organizacoes/${organizacaoId}/acoes`, { method: 'POST', body: dados, autenticado: true })
}
