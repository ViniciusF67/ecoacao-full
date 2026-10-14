import { api } from './api.js'

export async function listarCategorias() {
  return api('/categorias')
}

export async function criarCategoria(dados) {
  return api('/categorias', { method: 'POST', body: dados, autenticado: true })
}

export async function atualizarCategoria(id, dados) {
  return api(`/categorias/${id}`, { method: 'PUT', body: dados, autenticado: true })
}

export async function excluirCategoria(id) {
  return api(`/categorias/${id}`, { method: 'DELETE', autenticado: true })
}
