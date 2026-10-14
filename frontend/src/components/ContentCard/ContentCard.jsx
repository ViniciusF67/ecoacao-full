import { Link } from 'react-router-dom'
import Card from '../Card/Card.jsx'
import './ContentCard.css'

/** Espera o formato da API (GET /api/conteudos): { id, titulo, descricao, imagem, categoria_nome } */
export default function ContentCard({ conteudo }) {
  return (
    <Card className="content-card">
      <Link to={`/conteudos/${conteudo.id}`}>
        <img src={conteudo.imagem} alt={conteudo.titulo} className="content-card__image" loading="lazy" />
      </Link>
      <div className="content-card__body">
        <span className="tag">{conteudo.categoria_nome}</span>
        <h3 className="content-card__title">
          <Link to={`/conteudos/${conteudo.id}`}>{conteudo.titulo}</Link>
        </h3>
        <p className="content-card__desc">{conteudo.descricao}</p>
        <Link to={`/conteudos/${conteudo.id}`} className="content-card__link">
          Ler conteúdo →
        </Link>
      </div>
    </Card>
  )
}
