import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import Loading from '../components/Loading/Loading.jsx'

/**
 * Protege as rotas do painel administrativo (/admin/*) no frontend.
 *
 * Isso é só conveniência de navegação — mesmo que alguém burle esta
 * checagem no navegador, toda ação administrativa (criar notícia,
 * excluir usuário, etc.) chama a API, e a API valida de novo a
 * permissão no backend (middleware requirePermission). Sem o backend
 * aprovando, a ação simplesmente não acontece.
 */
export default function RotaAdmin({ children }) {
  const { usuario, isAdmin, carregando } = useAuth()

  if (carregando) return <Loading texto="Verificando permissões..." />
  if (!usuario) return <Navigate to="/login" replace />
  if (!isAdmin) return <Navigate to="/perfil" replace />

  return children
}
