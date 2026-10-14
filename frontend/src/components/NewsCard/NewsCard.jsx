import { Link } from 'react-router-dom'
import Card from '../Card/Card.jsx'
import { formatarData } from '../../utils/formatarData.js'
import './NewsCard.css'

/**
 * Espera o formato retornado pela API (GET /api/noticias):
 * { id, titulo, resumo, imagem, categoria_nome, autor_nome, data_publicacao }
 */
export default function NewsCard({ noticia }) {
  return (
    <Card className="news-card">
      <Link to={`/noticias/${noticia.id}`} className="news-card__image-link">
        <img src={noticia.imagem} alt={noticia.titulo} className="news-card__image" loading="lazy" />
      </Link>
      <div className="news-card__body">
        <span className="tag">{noticia.categoria_nome}</span>
        <h3 className="news-card__title">
          <Link to={`/noticias/${noticia.id}`}>{noticia.titulo}</Link>
        </h3>
        <p className="news-card__excerpt">{noticia.resumo}</p>
        <div className="news-card__meta">
          <span>{noticia.autor_nome}</span>
          <span>{formatarData(noticia.data_publicacao)}</span>
        </div>
        <Link to={`/noticias/${noticia.id}`} className="news-card__link">
          Ler notícia completa →
        </Link>
      </div>
    </Card>
  )
}
