import { api, salvarToken, removerToken } from './api.js'

export async function registrar({ nome, email, senha }) {
  const resposta = await api('/auth/register', { method: 'POST', body: { nome, email, senha } })
  salvarToken(resposta.token)
  return resposta.usuario
}

export async function login({ email, senha }) {
  const resposta = await api('/auth/login', { method: 'POST', body: { email, senha } })
  salvarToken(resposta.token)
  return resposta.usuario
}

export async function buscarUsuarioAutenticado() {
  return api('/auth/me', { autenticado: true })
}

export function logout() {
  removerToken()
}
