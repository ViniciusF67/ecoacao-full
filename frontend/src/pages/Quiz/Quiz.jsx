import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Card from '../../components/Card/Card.jsx'
import Button from '../../components/Button/Button.jsx'
import Loading from '../../components/Loading/Loading.jsx'
import EmptyState from '../../components/EmptyState/EmptyState.jsx'
import { listarQuizzes } from '../../services/quizService.js'
import './Quiz.css'

export default function Quiz() {
  const [quizzes, setQuizzes] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    listarQuizzes()
      .then(setQuizzes)
      .catch((err) => setErro(err.message))
      .finally(() => setCarregando(false))
  }, [])

  return (
    <div>
      <header className="page-header">
        <div className="container">
          <span className="eyebrow" style={{ background: 'rgba(255,255,255,0.15)', color: 'var(--eco-white)' }}>
            Quizzes
          </span>
          <h1>Teste seus conhecimentos</h1>
          <p>Escolha um tema e descubra o quanto você já sabe sobre sustentabilidade e meio ambiente.</p>
        </div>
      </header>

      <section className="section">
        <div className="container">
          {carregando ? (
            <Loading texto="Carregando quizzes..." />
          ) : erro ? (
            <EmptyState titulo="Não foi possível carregar os quizzes" descricao={erro} />
          ) : quizzes.length === 0 ? (
            <EmptyState titulo="Nenhum quiz disponível" descricao="Ainda não há quizzes publicados." />
          ) : (
            <div className="grid grid-3">
              {quizzes.map((q) => (
                <Card key={q.id} className="quiz-card">
                  <div className="quiz-card__body">
                    <span className="tag">{q.categoria_nome}</span>
                    <h3>{q.titulo}</h3>
                    <p>{q.descricao}</p>
                    <span className="quiz-card__count">{q.total_perguntas} perguntas</span>
                    <Button as={Link} to={`/quiz/${q.id}`} variant="primary" className="quiz-card__button">
                      Iniciar quiz
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
