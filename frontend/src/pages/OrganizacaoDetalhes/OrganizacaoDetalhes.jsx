import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Loading from '../../components/Loading/Loading.jsx'
import EmptyState from '../../components/EmptyState/EmptyState.jsx'
import { buscarOrganizacao } from '../../services/organizationService.js'
import './OrganizacaoDetalhes.css'

export default function OrganizacaoDetalhes() {
  const { id } = useParams()
  const [organizacao, setOrganizacao] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    let cancelado = false
    setCarregando(true)
    buscarOrganizacao(id)
      .then((dados) => { if (!cancelado) setOrganizacao(dados) })
      .catch((err) => { if (!cancelado) setErro(err.message) })
      .finally(() => { if (!cancelado) setCarregando(false) })
    return () => { cancelado = true }
  }, [id])

  if (carregando) return <Loading texto="Carregando organização..." />

  if (erro || !organizacao) {
    return (
      <div className="container">
        <EmptyState titulo="Organização não encontrada" descricao={erro || 'Esta organização pode ter sido removida.'} />
        <p className="text-center"><Link to="/organizacoes">Voltar para organizações</Link></p>
      </div>
    )
  }

  return (
    <div className="organizacao-detalhe">
      <div className="container">
        <Link to="/organizacoes" className="voltar-link">← Voltar para organizações</Link>

        <div className="organizacao-detalhe__header">
          <img src={organizacao.logo} alt={`Logo de ${organizacao.nome}`} className="organizacao-detalhe__logo" />
          <div>
            <span className="tag">{organizacao.categoria_nome}</span>
            <h1>{organizacao.nome}</h1>
          </div>
        </div>

        <div className="organizacao-detalhe__grid">
          <div className="detail-body">
            <p>{organizacao.descricao}</p>

            {organizacao.acoes?.length > 0 && (
              <>
                <h3>Ações e projetos</h3>
                <ul>
                  {organizacao.acoes.map((acao) => (
                    <li key={acao.id} style={{ marginBottom: 'var(--space-3)' }}>
                      <strong>{acao.titulo}</strong> — {acao.descricao}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          <aside className="organizacao-detalhe__contato">
            <h3>Contato</h3>
            <ul>
              {organizacao.email && (
                <li><strong>E-mail:</strong> <a href={`mailto:${organizacao.email}`}>{organizacao.email}</a></li>
              )}
              {organizacao.telefone && <li><strong>Telefone:</strong> {organizacao.telefone}</li>}
              {organizacao.site && (
                <li><strong>Site:</strong> <a href={organizacao.site} target="_blank" rel="noopener noreferrer">{organizacao.site}</a></li>
              )}
              {organizacao.endereco && <li><strong>Endereço:</strong> {organizacao.endereco}</li>}
            </ul>
          </aside>
        </div>
      </div>
    </div>
  )
}
