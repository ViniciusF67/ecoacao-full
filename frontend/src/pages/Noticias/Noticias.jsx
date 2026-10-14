import { useEffect, useState } from 'react'
import NewsCard from '../../components/NewsCard/NewsCard.jsx'
import EmptyState from '../../components/EmptyState/EmptyState.jsx'
import Loading from '../../components/Loading/Loading.jsx'
import { listarNoticias } from '../../services/newsService.js'
import { listarCategorias } from '../../services/categoryService.js'
import './Noticias.css'

export default function Noticias() {
  const [noticias, setNoticias] = useState([])
  const [categorias, setCategorias] = useState([])
  const [busca, setBusca] = useState('')
  const [categoriaAtiva, setCategoriaAtiva] = useState('todas')
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  // Carrega categorias uma vez
  useEffect(() => {
    listarCategorias().then(setCategorias).catch(() => setCategorias([]))
  }, [])

  // Recarrega notícias sempre que o filtro de categoria ou a busca mudar
  useEffect(() => {
    let cancelado = false
    setCarregando(true)
    setErro('')

    const categoriaId = categoriaAtiva !== 'todas' ? categoriaAtiva : undefined

    listarNoticias({ categoriaId, busca: busca.trim() || undefined })
      .then((dados) => { if (!cancelado) setNoticias(dados) })
      .catch((err) => { if (!cancelado) setErro(err.message) })
      .finally(() => { if (!cancelado) setCarregando(false) })

    return () => { cancelado = true }
  }, [categoriaAtiva, busca])

  return (
    <div>
      <header className="page-header">
        <div className="container">
          <span className="eyebrow" style={{ background: 'rgba(255,255,255,0.15)', color: 'var(--eco-white)' }}>
            Notícias
          </span>
          <h1>Notícias ambientais</h1>
          <p>Acompanhe as principais notícias sobre clima, energia, água, reciclagem e biodiversidade.</p>
        </div>
      </header>

      <section className="section">
        <div className="container">
          <div className="noticias-filtros">
            <input
              type="search"
              className="field__control noticias-busca"
              placeholder="Buscar notícias..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              aria-label="Buscar notícias"
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
            <Loading texto="Carregando notícias..." />
          ) : erro ? (
            <EmptyState
              titulo="Não foi possível carregar as notícias"
              descricao={erro}
            />
          ) : noticias.length === 0 ? (
            <EmptyState
              titulo="Nenhuma notícia encontrada"
              descricao="Não encontramos notícias para os filtros selecionados. Tente ajustar a busca ou a categoria."
            />
          ) : (
            <div className="grid grid-3">
              {noticias.map((n) => <NewsCard key={n.id} noticia={n} />)}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
