import { api } from './api.js'

export async function buscarMeuPerfil() {
  return api('/users/me', { autenticado: true })
}

export async function atualizarMeuPerfil(dados) {
  return api('/users/me', { method: 'PUT', body: dados, autenticado: true })
}

export async function alterarMinhaSenha({ senhaAtual, novaSenha }) {
  return api('/users/me/senha', { method: 'PUT', body: { senhaAtual, novaSenha }, autenticado: true })
}

/* ---------- Administração ---------- */

export async function listarUsuarios() {
  return api('/users', { autenticado: true })
}

export async function buscarUsuario(id) {
  return api(`/users/${id}`, { autenticado: true })
}

export async function alterarRoleDoUsuario(id, role) {
  return api(`/users/${id}/role`, { method: 'PUT', body: { role }, autenticado: true })
}

export async function alterarStatusDoUsuario(id, status) {
  return api(`/users/${id}/status`, { method: 'PUT', body: { status }, autenticado: true })
}

export async function excluirUsuario(id) {
  return api(`/users/${id}`, { method: 'DELETE', autenticado: true })
}
