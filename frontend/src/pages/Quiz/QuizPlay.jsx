import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import Button from '../../components/Button/Button.jsx'
import Loading from '../../components/Loading/Loading.jsx'
import EmptyState from '../../components/EmptyState/EmptyState.jsx'
import { buscarQuizParaResponder, responderQuiz } from '../../services/quizService.js'
import { useAuth } from '../../context/AuthContext.jsx'
import './QuizPlay.css'

/**
 * IMPORTANTE: o backend nunca envia qual alternativa é a correta antes de
 * o quiz ser respondido — por isso não é possível (nem seguro) mostrar
 * "certo/errado" pergunta a pergunta aqui. O usuário escolhe uma
 * alternativa por pergunta e só vê o resultado (calculado no servidor)
 * ao final, na página de Resultado.
 */
export default function QuizPlay() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { usuario } = useAuth()

  const [quiz, setQuiz] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)

  const [indiceAtual, setIndiceAtual] = useState(0)
  const [selecionada, setSelecionada] = useState(null)
  const [respostas, setRespostas] = useState([])

  useEffect(() => {
    buscarQuizParaResponder(id)
      .then(setQuiz)
      .catch((err) => setErro(err.message))
      .finally(() => setCarregando(false))
  }, [id])

  if (carregando) return <Loading texto="Carregando quiz..." />

  if (erro || !quiz) {
    return (
      <div className="container">
        <EmptyState titulo="Quiz não encontrado" descricao={erro || 'Este quiz pode ter sido removido.'} />
        <p className="text-center"><Link to="/quiz">Voltar aos quizzes</Link></p>
      </div>
    )
  }

  if (!usuario) {
    return (
      <div className="container">
        <EmptyState
          titulo="Entre na sua conta para fazer este quiz"
          descricao="O resultado do quiz fica salvo no seu histórico de perfil."
        />
        <p className="text-center"><Link to="/login" state={{ de: `/quiz/${id}` }}>Entrar</Link></p>
      </div>
    )
  }

  const pergunta = quiz.perguntas[indiceAtual]
  const progresso = Math.round((indiceAtual / quiz.perguntas.length) * 100)
  const ultimaPergunta = indiceAtual + 1 === quiz.perguntas.length

  function selecionarAlternativa(alternativaId) {
    setSelecionada(alternativaId)
  }

  async function proximaPergunta() {
    const novasRespostas = [...respostas, { perguntaId: pergunta.id, alternativaId: selecionada }]
    setRespostas(novasRespostas)

    if (!ultimaPergunta) {
      setIndiceAtual((i) => i + 1)
      setSelecionada(null)
      return
    }

    setEnviando(true)
    try {
      const resultado = await responderQuiz(quiz.id, novasRespostas)
      navigate(`/quiz/${quiz.id}/resultado`, {
        state: { quizId: quiz.id, quizTitulo: quiz.titulo, ...resultado },
        replace: true,
      })
    } catch (err) {
      setErro(err.message)
      setEnviando(false)
    }
  }

  return (
    <div className="quiz-play">
      <div className="container quiz-play__inner">
        <Link to="/quiz" className="voltar-link">← Sair do quiz</Link>

        {erro && <p className="form-message error">{erro}</p>}

        <div className="quiz-play__progress-track">
          <div className="quiz-play__progress-bar" style={{ width: `${progresso}%` }} />
        </div>
        <p className="quiz-play__step">
          Pergunta {indiceAtual + 1} de {quiz.perguntas.length}
        </p>

        <h2 className="quiz-play__question">{pergunta.enunciado}</h2>

        <div className="quiz-play__options">
          {pergunta.alternativas.map((alt) => (
            <button
              key={alt.id}
              type="button"
              className={`quiz-option ${selecionada === alt.id ? 'is-selected' : ''}`}
              onClick={() => selecionarAlternativa(alt.id)}
              disabled={enviando}
            >
              {alt.texto}
            </button>
          ))}
        </div>

        <Button
          variant="primary"
          size="lg"
          className="quiz-play__next"
          disabled={selecionada === null || enviando}
          onClick={proximaPergunta}
        >
          {enviando ? 'Calculando resultado...' : ultimaPergunta ? 'Ver resultado' : 'Próxima pergunta'}
        </Button>
      </div>
    </div>
  )
}
