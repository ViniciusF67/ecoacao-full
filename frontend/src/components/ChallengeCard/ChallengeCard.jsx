import { Link } from 'react-router-dom'
import Card from '../Card/Card.jsx'
import './ChallengeCard.css'

const corDificuldade = {
  'Fácil': 'challenge-card__difficulty--easy',
  'Médio': 'challenge-card__difficulty--medium',
  'Difícil': 'challenge-card__difficulty--hard',
}

/** Espera o formato da API (GET /api/desafios): { id, titulo, descricao, imagem, categoria_nome, dificuldade } */
export default function ChallengeCard({ desafio }) {
  return (
    <Card className="challenge-card">
      <Link to={`/desafios/${desafio.id}`}>
        <img src={desafio.imagem} alt={desafio.titulo} className="challenge-card__image" loading="lazy" />
      </Link>
      <div className="challenge-card__body">
        <div className="challenge-card__tags">
          <span className="tag">{desafio.categoria_nome}</span>
          <span className={`challenge-card__difficulty ${corDificuldade[desafio.dificuldade] ?? ''}`}>
            {desafio.dificuldade}
          </span>
        </div>
        <h3 className="challenge-card__title">
          <Link to={`/desafios/${desafio.id}`}>{desafio.titulo}</Link>
        </h3>
        <p className="challenge-card__desc">{desafio.descricao}</p>
        <Link to={`/desafios/${desafio.id}`} className="content-card__link">
          Ver desafio →
        </Link>
      </div>
    </Card>
  )
}
