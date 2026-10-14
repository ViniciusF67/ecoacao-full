/**
 * Cliente HTTP central da API do ECOAÇÃO.
 *
 * Centraliza: URL base, envio automático do token JWT (quando existe),
 * parse de JSON e tratamento padronizado de erros. Todos os outros
 * arquivos em src/services/ usam esta função em vez de chamar fetch()
 * diretamente.
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
const TOKEN_KEY = 'ecoacao_token'

export function obterToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function salvarToken(token) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function removerToken() {
  localStorage.removeItem(TOKEN_KEY)
}

/**
 * Executa uma requisição à API.
 * @param {string} caminho - ex.: '/noticias' ou '/noticias/5'
 * @param {object} opcoes - { method, body, autenticado }
 */
export async function api(caminho, { method = 'GET', body, autenticado = false } = {}) {
  const headers = { 'Content-Type': 'application/json' }

  if (autenticado) {
    const token = obterToken()
    if (token) headers.Authorization = `Bearer ${token}`
  }

  let resposta
  try {
    resposta = await fetch(`${API_URL}${caminho}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch (err) {
    // Erro de rede (backend fora do ar, CORS mal configurado, etc.)
    const erro = new Error(
      'Não foi possível conectar à API do ECOAÇÃO. Verifique se o backend está rodando em ' + API_URL
    )
    erro.causa = err
    throw erro
  }

  // 204 No Content não tem corpo para parsear
  if (resposta.status === 204) return null

  let dados = null
  try {
    dados = await resposta.json()
  } catch {
    // resposta sem corpo JSON válido — segue com dados = null
  }

  if (!resposta.ok) {
    const mensagem = dados?.erro || `Erro ${resposta.status} ao acessar ${caminho}`
    const erro = new Error(mensagem)
    erro.status = resposta.status
    throw erro
  }

  return dados
}
