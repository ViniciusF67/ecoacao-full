import { useEffect, useState } from 'react'
import Button from '../../components/Button/Button.jsx'
import Input from '../../components/Input/Input.jsx'
import Loading from '../../components/Loading/Loading.jsx'
import EmptyState from '../../components/EmptyState/EmptyState.jsx'
import { listarNoticias, criarNoticia, atualizarNoticia, excluirNoticia } from '../../services/newsService.js'
import { listarCategorias } from '../../services/categoryService.js'
import { formatarData } from '../../utils/formatarData.js'

const vazio = { titulo: '', resumo: '', conteudo: '', imagem: '', categoriaId: '' }

export default function AdminNoticias() {
  const [noticias, setNoticias] = useState([])
  const [categorias, setCategorias] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [mostrarForm, setMostrarForm] = useState(false)
  const [editando, setEditando] = useState(null)
  const [valores, setValores] = useState(vazio)
  const [salvando, setSalvando] = useState(false)
  const [erroForm, setErroForm] = useState('')

  function carregar() {
    setCarregando(true)
    Promise.all([listarNoticias(), listarCategorias()])
      .then(([n, c]) => { setNoticias(n); setCategorias(c) })
      .catch((err) => setErro(err.message))
      .finally(() => setCarregando(false))
  }
  useEffect(carregar, [])

  function abrirForm(noticia = null) {
    setEditando(noticia?.id || null)
    setValores(noticia ? {
      titulo: noticia.titulo || '', resumo: noticia.resumo || '', conteudo: noticia.conteudo || '',
      imagem: noticia.imagem || '', categoriaId: noticia.categoria_id || ''
    } : vazio)
    setErroForm('')
    setMostrarForm(true)
  }

  function handleChange(e) {
    const { name, value } = e.target
    setValores((v) => ({ ...v, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErroForm('')
    if (!valores.titulo.trim() || !valores.resumo.trim() || !valores.conteudo.trim() || !valores.categoriaId) {
      setErroForm('Preencha título, resumo, conteúdo e categoria.')
      return
    }
    setSalvando(true)
    try {
      if (editando) await atualizarNoticia(editando, valores)
      else await criarNoticia(valores)
      setValores(vazio)
      setEditando(null)
      setMostrarForm(false)
      carregar()
    } catch (err) { setErroForm(err.message) }
    finally { setSalvando(false) }
  }

  async function handleExcluir(id) {
    if (!confirm('Excluir esta notícia? Esta ação não pode ser desfeita.')) return
    try { await excluirNoticia(id); carregar() } catch (err) { alert(err.message) }
  }

  return <div>
    <div className="admin__header">
      <h1>Notícias</h1>
      <Button variant="primary" onClick={() => mostrarForm ? setMostrarForm(false) : abrirForm()}>
        {mostrarForm ? 'Cancelar' : 'Nova notícia'}
      </Button>
    </div>

    {mostrarForm && <form className="admin__form" onSubmit={handleSubmit} noValidate>
      <h3>{editando ? 'Editar notícia' : 'Nova notícia'}</h3>
      {erroForm && <p className="form-message error">{erroForm}</p>}
      <Input id="titulo" name="titulo" label="Título" value={valores.titulo} onChange={handleChange} />
      <Input id="resumo" name="resumo" label="Resumo" value={valores.resumo} onChange={handleChange} />
      <Input id="conteudo" name="conteudo" as="textarea" rows={7} label="Conteúdo" value={valores.conteudo} onChange={handleChange} />
      <Input id="imagem" name="imagem" label="URL da imagem" value={valores.imagem} onChange={handleChange} />
      <div className="field">
        <label className="field__label" htmlFor="categoriaId">Categoria</label>
        <select id="categoriaId" name="categoriaId" className="field__control" value={valores.categoriaId} onChange={handleChange}>
          <option value="">Selecione...</option>
          {categorias.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
        </select>
      </div>
      <Button type="submit" variant="primary" disabled={salvando}>{salvando ? 'Salvando...' : 'Salvar notícia'}</Button>
    </form>}

    {carregando ? <Loading texto="Carregando notícias..." /> :
      erro ? <EmptyState titulo="Não foi possível carregar" descricao={erro} /> :
      noticias.length === 0 ? <EmptyState titulo="Nenhuma notícia cadastrada" /> :
      <div className="admin__table-wrap"><table className="admin__table"><thead><tr>
        <th>Título</th><th>Categoria</th><th>Autor</th><th>Publicada em</th><th>Ações</th>
      </tr></thead><tbody>
        {noticias.map((n) => <tr key={n.id}>
          <td>{n.titulo}</td><td>{n.categoria_nome}</td><td>{n.autor_nome}</td><td>{formatarData(n.data_publicacao)}</td>
          <td className="admin__row-actions">
            <Button variant="ghost" size="sm" onClick={() => abrirForm(n)}>Editar</Button>
            <Button variant="ghost" size="sm" onClick={() => handleExcluir(n.id)}>Excluir</Button>
          </td>
        </tr>)}
      </tbody></table></div>}
  </div>
}
