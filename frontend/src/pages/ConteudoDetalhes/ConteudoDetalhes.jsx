import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Loading from '../../components/Loading/Loading.jsx'
import EmptyState from '../../components/EmptyState/EmptyState.jsx'
import { buscarConteudo } from '../../services/contentService.js'
import { formatarData } from '../../utils/formatarData.js'
import './ConteudoDetalhes.css'

export default function ConteudoDetalhes() {
  const { id } = useParams()
  const [conteudo, setConteudo] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    let cancelado = false
    setCarregando(true)
    buscarConteudo(id)
      .then((dados) => { if (!cancelado) setConteudo(dados) })
      .catch((err) => { if (!cancelado) setErro(err.message) })
      .finally(() => { if (!cancelado) setCarregando(false) })
    return () => { cancelado = true }
  }, [id])

  if (carregando) return <Loading texto="Carregando conteúdo..." />

  if (erro || !conteudo) {
    return (
      <div className="container">
        <EmptyState titulo="Conteúdo não encontrado" descricao={erro || 'Este conteúdo pode ter sido removido.'} />
        <p className="text-center"><Link to="/conteudos">Voltar para conteúdos</Link></p>
      </div>
    )
  }

  return (
    <div className="conteudo-detalhe">
      <div className="container">
        <Link to="/conteudos" className="voltar-link">← Voltar para conteúdos</Link>

        <span className="tag">{conteudo.categoria_nome}</span>
        <h1>{conteudo.titulo}</h1>
        <div className="detail-meta">
          <span>Por {conteudo.autor_nome}</span>
          <span aria-hidden="true">•</span>
          <span>{formatarData(conteudo.data_publicacao)}</span>
        </div>

        <img src={conteudo.imagem} alt={conteudo.titulo} className="detail-image" />

        <div className="detail-body">
          <p style={{ fontWeight: 600, color: 'var(--eco-dark)' }}>{conteudo.descricao}</p>
          {conteudo.conteudo.split('\n\n').map((paragrafo, i) => (
            <p key={i}>{paragrafo}</p>
          ))}
        </div>
      </div>
    </div>
  )
}
