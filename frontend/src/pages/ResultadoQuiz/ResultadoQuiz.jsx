import { Link, useLocation, Navigate } from 'react-router-dom'
import Button from '../../components/Button/Button.jsx'
import './ResultadoQuiz.css'

function mensagemResultado(percentual) {
  if (percentual === 100) return 'Perfeito! Você domina o assunto.'
  if (percentual >= 70) return 'Muito bem! Você está bem informado sobre o tema.'
  if (percentual >= 40) return 'Bom começo! Vale a pena revisar alguns conteúdos.'
  return 'Continue estudando — os conteúdos educativos do ECOAÇÃO podem ajudar.'
}

export default function ResultadoQuiz() {
  const location = useLocation()
  const dados = location.state

  if (!dados) return <Navigate to="/quiz" replace />

  // pontuacao já vem calculada e validada pelo backend (0-100)
  const { quizId, quizTitulo, total, acertos, erros, pontuacao } = dados
  const percentual = Math.round(pontuacao)

  return (
    <div className="resultado-quiz">
      <div className="container resultado-quiz__inner">
        <span className="eyebrow">Resultado</span>
        <h1>{quizTitulo}</h1>

        <div className="resultado-quiz__score">
          <span className="resultado-quiz__percent">{percentual}%</span>
          <p>{mensagemResultado(percentual)}</p>
        </div>

        <div className="resultado-quiz__stats">
          <div className="resultado-quiz__stat">
            <strong>{total}</strong>
            <span>Perguntas</span>
          </div>
          <div className="resultado-quiz__stat resultado-quiz__stat--success">
            <strong>{acertos}</strong>
            <span>Acertos</span>
          </div>
          <div className="resultado-quiz__stat resultado-quiz__stat--error">
            <strong>{erros}</strong>
            <span>Erros</span>
          </div>
        </div>

        <div className="resultado-quiz__actions">
          <Button as={Link} to={`/quiz/${quizId}`} variant="primary" size="lg">
            Tentar novamente
          </Button>
          <Button as={Link} to="/quiz" variant="ghost" size="lg">
            Voltar aos quizzes
          </Button>
        </div>
      </div>
    </div>
  )
}
