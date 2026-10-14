import { Link } from 'react-router-dom'
import Card from '../Card/Card.jsx'
import './OrganizationCard.css'

/** Espera o formato da API (GET /api/organizacoes): { id, nome, descricao, logo, categoria_nome } */
export default function OrganizationCard({ organizacao }) {
  return (
    <Card className="org-card">
      <Link to={`/organizacoes/${organizacao.id}`} className="org-card__header">
        <img src={organizacao.logo} alt={`Logo de ${organizacao.nome}`} className="org-card__logo" loading="lazy" />
        <div>
          <h3 className="org-card__title">{organizacao.nome}</h3>
          <span className="tag">{organizacao.categoria_nome}</span>
        </div>
      </Link>
      <div className="org-card__body">
        <p>{organizacao.descricao}</p>
        <Link to={`/organizacoes/${organizacao.id}`} className="content-card__link">
          Ver organização →
        </Link>
      </div>
    </Card>
  )
}
