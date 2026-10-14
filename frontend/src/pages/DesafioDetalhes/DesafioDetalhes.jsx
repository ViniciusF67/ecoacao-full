import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import Button from '../../components/Button/Button.jsx'
import Loading from '../../components/Loading/Loading.jsx'
import EmptyState from '../../components/EmptyState/EmptyState.jsx'
import { buscarDesafio, minhaParticipacao, participarDoDesafio, concluirDesafio } from '../../services/challengeService.js'
import { useAuth } from '../../context/AuthContext.jsx'
import './DesafioDetalhes.css'

export default function DesafioDetalhes() {
  const { id } = useParams()
  const { usuario } = useAuth()

  const [desafio, setDesafio] = useState(null)
  const [participacao, setParticipacao] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [processando, setProcessando] = useState(false)

  useEffect(() => {
    let cancelado = false
    setCarregando(true)

    buscarDesafio(id)
      .then(async (dados) => {
        if (cancelado) return
        setDesafio(dados)
        if (usuario) {
          const participacaoAtual = await minhaParticipacao(id).catch(() => null)
          if (!cancelado) setParticipacao(participacaoAtual)
        }
      })
      .catch((err) => { if (!cancelado) setErro(err.message) })
      .finally(() => { if (!cancelado) setCarregando(false) })

    return () => { cancelado = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, usuario?.id])

  if (carregando) return <Loading texto="Carregando desafio..." />

  if (erro || !desafio) {
    return (
      <div className="container">
        <EmptyState titulo="Desafio não encontrado" descricao={erro || 'Este desafio pode ter sido removido.'} />
        <p className="text-center"><Link to="/desafios">Voltar para desafios</Link></p>
      </div>
    )
  }

  async function participar() {
    setProcessando(true)
    try {
      const nova = await participarDoDesafio(id)
      setParticipacao(nova)
    } catch (err) {
      setErro(err.message)
    } finally {
      setProcessando(false)
    }
  }

  async function concluir() {
    setProcessando(true)
    try {
      const atualizada = await concluirDesafio(id)
      setParticipacao(atualizada)
    } catch (err) {
      setErro(err.message)
    } finally {
      setProcessando(false)
    }
  }

  return (
    <div className="desafio-detalhe">
      <div className="container">
        <Link to="/desafios" className="voltar-link">← Voltar para desafios</Link>

        <div className="desafio-detalhe__tags">
          <span className="tag">{desafio.categoria_nome}</span>
          <span className="tag" style={{ background: 'var(--eco-green-100)', color: 'var(--eco-green-700)' }}>
            Dificuldade: {desafio.dificuldade}
          </span>
        </div>

        <h1>{desafio.titulo}</h1>

        <img src={desafio.imagem} alt={desafio.titulo} className="detail-image" />

        <div className="detail-body">
          <p>{desafio.descricao}</p>
          <h3>Como participar</h3>
          <p>{desafio.instrucoes}</p>
        </div>

        {erro && <p className="form-message error">{erro}</p>}

        <div className="desafio-detalhe__acao">
          {!usuario ? (
            <p className="desafio-detalhe__aviso">
              <Link to="/login" state={{ de: `/desafios/${id}` }}>Entre na sua conta</Link> para registrar
              sua participação neste desafio.
            </p>
          ) : !participacao ? (
            <Button variant="primary" size="lg" onClick={participar} disabled={processando}>
              {processando ? 'Registrando...' : 'Quero participar'}
            </Button>
          ) : participacao.status === 'em_andamento' ? (
            <div className="desafio-detalhe__status">
              <p className="form-message success">Participação registrada! Marque como concluído quando terminar.</p>
              <Button variant="secondary" size="lg" onClick={concluir} disabled={processando}>
                {processando ? 'Salvando...' : 'Marcar como concluído'}
              </Button>
            </div>
          ) : (
            <p className="form-message success">
              Desafio concluído! Continue explorando outros desafios do ECOAÇÃO.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
