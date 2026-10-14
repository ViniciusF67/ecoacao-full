import { api } from './api.js'

export async function listarRoles() {
  return api('/admin/roles', { autenticado: true })
}

export async function listarPermissoes() {
  return api('/admin/permissions', { autenticado: true })
}

export async function buscarResumo() {
  return api('/admin/resumo', { autenticado: true })
}
