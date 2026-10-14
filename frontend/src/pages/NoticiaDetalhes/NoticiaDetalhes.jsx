import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import NewsCard from '../../components/NewsCard/NewsCard.jsx'
import Loading from '../../components/Loading/Loading.jsx'
import EmptyState from '../../components/EmptyState/EmptyState.jsx'
import { buscarNoticia, listarNoticias } from '../../services/newsService.js'
import { formatarData } from '../../utils/formatarData.js'
import './NoticiaDetalhes.css'

export default function NoticiaDetalhes() {
  const { id } = useParams()
  const [noticia, setNoticia] = useState(null)
  const [relacionadas, setRelacionadas] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    let cancelado = false
    setCarregando(true)
    setErro('')

    buscarNoticia(id)
      .then(async (dados) => {
        if (cancelado) return
        setNoticia(dados)
        const outras = await listarNoticias({ categoriaId: dados.categoria_id })
        if (!cancelado) setRelacionadas(outras.filter((n) => n.id !== dados.id).slice(0, 3))
      })
      .catch((err) => { if (!cancelado) setErro(err.message) })
      .finally(() => { if (!cancelado) setCarregando(false) })

    return () => { cancelado = true }
  }, [id])

  if (carregando) return <Loading texto="Carregando notícia..." />

  if (erro || !noticia) {
    return (
      <div className="container">
        <EmptyState
          titulo="Notícia não encontrada"
          descricao={erro || 'Esta notícia pode ter sido removida.'}
        />
        <p className="text-center"><Link to="/noticias">Voltar para notícias</Link></p>
      </div>
    )
  }

  return (
    <div className="noticia-detalhe">
      <div className="container">
        <Link to="/noticias" className="voltar-link">← Voltar para notícias</Link>

        <span className="tag">{noticia.categoria_nome}</span>
        <h1>{noticia.titulo}</h1>
        <div className="detail-meta">
          <span>Por {noticia.autor_nome}</span>
          <span aria-hidden="true">•</span>
          <span>{formatarData(noticia.data_publicacao)}</span>
        </div>

        <img src={noticia.imagem} alt={noticia.titulo} className="detail-image" />

        <div className="detail-body">
          {noticia.conteudo.split('\n\n').map((paragrafo, i) => (
            <p key={i}>{paragrafo}</p>
          ))}
        </div>
      </div>

      {relacionadas.length > 0 && (
        <section className="section section--tinted">
          <div className="container">
            <h2>Notícias relacionadas</h2>
            <div className="grid grid-3">
              {relacionadas.map((n) => <NewsCard key={n.id} noticia={n} />)}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
