import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import Loading from '../components/Loading/Loading.jsx'

/**
 * Protege rotas que exigem usuário autenticado (ex.: Perfil, Editar Perfil).
 * Isso é apenas uma conveniência de navegação no frontend — a proteção real
 * dos dados deve sempre ocorrer no backend, validando o token em cada
 * requisição sensível.
 */
export default function RotaProtegida({ children }) {
  const { usuario, carregando } = useAuth()
  const location = useLocation()

  if (carregando) return <Loading texto="Verificando sessão..." />

  if (!usuario) {
    return <Navigate to="/login" replace state={{ de: location.pathname }} />
  }

  return children
}
