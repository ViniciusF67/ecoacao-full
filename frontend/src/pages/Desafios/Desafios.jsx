import { useEffect, useState } from 'react'
import ChallengeCard from '../../components/ChallengeCard/ChallengeCard.jsx'
import EmptyState from '../../components/EmptyState/EmptyState.jsx'
import Loading from '../../components/Loading/Loading.jsx'
import { listarDesafios } from '../../services/challengeService.js'
import { listarCategorias } from '../../services/categoryService.js'
import './Desafios.css'

const dificuldades = ['Fácil', 'Médio', 'Difícil']

export default function Desafios() {
  const [desafios, setDesafios] = useState([])
  const [categorias, setCategorias] = useState([])
  const [categoriaAtiva, setCategoriaAtiva] = useState('todas')
  const [dificuldadeAtiva, setDificuldadeAtiva] = useState('todas')
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    listarCategorias().then(setCategorias).catch(() => setCategorias([]))
  }, [])

  useEffect(() => {
    let cancelado = false
    setCarregando(true)
    const categoriaId = categoriaAtiva !== 'todas' ? categoriaAtiva : undefined
    const dificuldade = dificuldadeAtiva !== 'todas' ? dificuldadeAtiva : undefined

    listarDesafios({ categoriaId, dificuldade })
      .then((dados) => { if (!cancelado) setDesafios(dados) })
      .catch((err) => { if (!cancelado) setErro(err.message) })
      .finally(() => { if (!cancelado) setCarregando(false) })

    return () => { cancelado = true }
  }, [categoriaAtiva, dificuldadeAtiva])

  return (
    <div>
      <header className="page-header">
        <div className="container">
          <span className="eyebrow" style={{ background: 'rgba(255,255,255,0.15)', color: 'var(--eco-white)' }}>
            Desafios
          </span>
          <h1>Desafios ambientais</h1>
          <p>Pequenas ações práticas para colocar a consciência ambiental no seu dia a dia.</p>
        </div>
      </header>

      <section className="section">
        <div className="container">
          <div className="conteudos-filtros" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <select
              className="field__control"
              value={categoriaAtiva}
              onChange={(e) => setCategoriaAtiva(e.target.value)}
              aria-label="Filtrar por categoria"
            >
              <option value="todas">Todas as categorias</option>
              {categorias.map((c) => (
                <option key={c.id} value={c.id}>{c.nome}</option>
              ))}
            </select>
            <select
              className="field__control"
              value={dificuldadeAtiva}
              onChange={(e) => setDificuldadeAtiva(e.target.value)}
              aria-label="Filtrar por dificuldade"
            >
              <option value="todas">Todas as dificuldades</option>
              {dificuldades.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          {carregando ? (
            <Loading texto="Carregando desafios..." />
          ) : erro ? (
            <EmptyState titulo="Não foi possível carregar os desafios" descricao={erro} />
          ) : desafios.length === 0 ? (
            <EmptyState
              titulo="Nenhum desafio encontrado"
              descricao="Não encontramos desafios para os filtros selecionados."
            />
          ) : (
            <div className="grid grid-3">
              {desafios.map((d) => <ChallengeCard key={d.id} desafio={d} />)}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
