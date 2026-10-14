import { useEffect, useState } from 'react'
import ContentCard from '../../components/ContentCard/ContentCard.jsx'
import EmptyState from '../../components/EmptyState/EmptyState.jsx'
import Loading from '../../components/Loading/Loading.jsx'
import { listarConteudos } from '../../services/contentService.js'
import { listarCategorias } from '../../services/categoryService.js'
import './Conteudos.css'

export default function Conteudos() {
  const [conteudos, setConteudos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [busca, setBusca] = useState('')
  const [categoriaAtiva, setCategoriaAtiva] = useState('todas')
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    listarCategorias().then(setCategorias).catch(() => setCategorias([]))
  }, [])

  useEffect(() => {
    let cancelado = false
    setCarregando(true)
    setErro('')

    const categoriaId = categoriaAtiva !== 'todas' ? categoriaAtiva : undefined

    listarConteudos({ categoriaId, busca: busca.trim() || undefined })
      .then((dados) => { if (!cancelado) setConteudos(dados) })
      .catch((err) => { if (!cancelado) setErro(err.message) })
      .finally(() => { if (!cancelado) setCarregando(false) })

    return () => { cancelado = true }
  }, [categoriaAtiva, busca])

  return (
    <div>
      <header className="page-header">
        <div className="container">
          <span className="eyebrow" style={{ background: 'rgba(255,255,255,0.15)', color: 'var(--eco-white)' }}>
            Conteúdos educativos
          </span>
          <h1>Aprenda sobre sustentabilidade</h1>
          <p>Textos explicativos sobre os principais temas ambientais, pensados para estudantes e educadores.</p>
        </div>
      </header>

      <section className="section">
        <div className="container">
          <div className="conteudos-filtros">
            <input
              type="search"
              className="field__control"
              placeholder="Buscar conteúdos..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              aria-label="Buscar conteúdos"
            />
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
          </div>

          {carregando ? (
            <Loading texto="Carregando conteúdos..." />
          ) : erro ? (
            <EmptyState titulo="Não foi possível carregar os conteúdos" descricao={erro} />
          ) : conteudos.length === 0 ? (
            <EmptyState
              titulo="Nenhum conteúdo encontrado"
              descricao="Não encontramos conteúdos para os filtros selecionados."
            />
          ) : (
            <div className="grid grid-3">
              {conteudos.map((c) => <ContentCard key={c.id} conteudo={c} />)}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
