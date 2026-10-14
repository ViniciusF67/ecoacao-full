import { useEffect, useState } from 'react'
import OrganizationCard from '../../components/OrganizationCard/OrganizationCard.jsx'
import EmptyState from '../../components/EmptyState/EmptyState.jsx'
import Loading from '../../components/Loading/Loading.jsx'
import { listarOrganizacoes } from '../../services/organizationService.js'
import { listarCategorias } from '../../services/categoryService.js'
import './Organizacoes.css'

export default function Organizacoes() {
  const [organizacoes, setOrganizacoes] = useState([])
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
    const categoriaId = categoriaAtiva !== 'todas' ? categoriaAtiva : undefined

    listarOrganizacoes({ categoriaId, busca: busca.trim() || undefined })
      .then((dados) => { if (!cancelado) setOrganizacoes(dados) })
      .catch((err) => { if (!cancelado) setErro(err.message) })
      .finally(() => { if (!cancelado) setCarregando(false) })

    return () => { cancelado = true }
  }, [categoriaAtiva, busca])

  return (
    <div>
      <header className="page-header">
        <div className="container">
          <span className="eyebrow" style={{ background: 'rgba(255,255,255,0.15)', color: 'var(--eco-white)' }}>
            Organizações
          </span>
          <h1>Organizações e empresas parceiras</h1>
          <p>Conheça iniciativas e negócios que atuam com sustentabilidade e meio ambiente.</p>
        </div>
      </header>

      <section className="section">
        <div className="container">
          <div className="conteudos-filtros" style={{ gridTemplateColumns: '2fr 1fr' }}>
            <input
              type="search"
              className="field__control"
              placeholder="Buscar organizações..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              aria-label="Buscar organizações"
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
            <Loading texto="Carregando organizações..." />
          ) : erro ? (
            <EmptyState titulo="Não foi possível carregar as organizações" descricao={erro} />
          ) : organizacoes.length === 0 ? (
            <EmptyState
              titulo="Nenhuma organização encontrada"
              descricao="Não encontramos organizações para os filtros selecionados."
            />
          ) : (
            <div className="grid grid-3">
              {organizacoes.map((o) => <OrganizationCard key={o.id} organizacao={o} />)}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
