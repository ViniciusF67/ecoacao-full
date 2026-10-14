import { createContext, useContext, useEffect, useState } from 'react'
import * as authService from '../services/authService.js'
import * as userService from '../services/userService.js'
import { obterToken } from '../services/api.js'

/**
 * AuthContext — gerenciamento de sessão do usuário, conectado à API real
 * do backend (Node/Express + JWT). O token fica em localStorage e é
 * enviado automaticamente pelo cliente HTTP (ver services/api.js) em
 * toda chamada marcada como `autenticado: true`.
 *
 * IMPORTANTE (segurança): esconder elementos de interface com base em
 * `isAdmin` é só conveniência de UX. A validação de permissão real
 * acontece sempre no backend (middleware requirePermission), então
 * mesmo que alguém force a exibição de um botão no navegador, a API
 * vai recusar a requisição sem a permissão correta.
 */

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    async function restaurarSessao() {
      const token = obterToken()
      if (!token) {
        setCarregando(false)
        return
      }
      try {
        const dados = await authService.buscarUsuarioAutenticado()
        setUsuario(dados)
      } catch {
        authService.logout() // token expirado/inválido
      } finally {
        setCarregando(false)
      }
    }
    restaurarSessao()
  }, [])

  async function login(email, senha) {
    try {
      const dadosUsuario = await authService.login({ email, senha })
      setUsuario(dadosUsuario)
      return { ok: true }
    } catch (err) {
      return { ok: false, erro: err.message }
    }
  }

  async function cadastrar({ nome, email, senha }) {
    try {
      const dadosUsuario = await authService.registrar({ nome, email, senha })
      setUsuario(dadosUsuario)
      return { ok: true }
    } catch (err) {
      return { ok: false, erro: err.message }
    }
  }

  function logout() {
    authService.logout()
    setUsuario(null)
  }

  async function atualizarPerfil(dados) {
    try {
      const atualizado = await userService.atualizarMeuPerfil(dados)
      setUsuario((atual) => ({ ...atual, ...atualizado }))
      return { ok: true }
    } catch (err) {
      return { ok: false, erro: err.message }
    }
  }

  const isAdmin = usuario?.role === 'admin' || usuario?.role === 'superadmin'
  const isColaborador = isAdmin || usuario?.role === 'colaborador'

  return (
    <AuthContext.Provider
      value={{ usuario, carregando, isAdmin, isColaborador, login, cadastrar, logout, atualizarPerfil }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve ser usado dentro de <AuthProvider>')
  return ctx
}
