import { useEffect, useState } from 'react'
import Loading from '../../components/Loading/Loading.jsx'
import EmptyState from '../../components/EmptyState/EmptyState.jsx'
import { buscarResumo } from '../../services/adminService.js'
import { useAuth } from '../../context/AuthContext.jsx'

export default function AdminDashboard() {
  const { usuario } = useAuth()
  const [resumo, setResumo] = useState(null)
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    buscarResumo()
      .then(setResumo)
      .catch((err) => setErro(err.message))
      .finally(() => setCarregando(false))
  }, [])

  return (
    <div>
      <div className="admin__header">
        <h1>Visão geral</h1>
      </div>
      <p style={{ marginBottom: 'var(--space-5)' }}>
        Olá, {usuario.nome.split(' ')[0]}. Você está conectado como <strong>{usuario.role}</strong>.
      </p>

      {carregando ? (
        <Loading texto="Carregando resumo..." />
      ) : erro ? (
        <EmptyState titulo="Não foi possível carregar o resumo" descricao={erro} />
      ) : (
        <div className="admin__stats-grid">
          <div className="admin__stat"><strong>{resumo.totalUsuarios}</strong><span>Usuários</span></div>
          <div className="admin__stat"><strong>{resumo.totalNoticias}</strong><span>Notícias</span></div>
          <div className="admin__stat"><strong>{resumo.totalConteudos}</strong><span>Conteúdos</span></div>
          <div className="admin__stat"><strong>{resumo.totalQuizzes}</strong><span>Quizzes</span></div>
          <div className="admin__stat"><strong>{resumo.totalDesafios}</strong><span>Desafios</span></div>
          <div className="admin__stat"><strong>{resumo.totalOrganizacoes}</strong><span>Organizações</span></div>
        </div>
      )}
    </div>
  )
}
