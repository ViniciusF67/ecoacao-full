import { useEffect, useState } from 'react'
import Button from '../../components/Button/Button.jsx'
import Input from '../../components/Input/Input.jsx'
import Loading from '../../components/Loading/Loading.jsx'
import EmptyState from '../../components/EmptyState/EmptyState.jsx'
import { listarConteudos, criarConteudo, atualizarConteudo, excluirConteudo } from '../../services/contentService.js'
import { listarCategorias } from '../../services/categoryService.js'
import { formatarData } from '../../utils/formatarData.js'

const vazio = { titulo: '', descricao: '', conteudo: '', imagem: '', categoriaId: '' }

export default function AdminConteudos() {
  const [itens, setItens] = useState([])
  const [categorias, setCategorias] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [form, setForm] = useState(vazio)
  const [editando, setEditando] = useState(null)
  const [aberto, setAberto] = useState(false)
  const [salvando, setSalvando] = useState(false)
  const [erroForm, setErroForm] = useState('')

  function carregar() {
    setCarregando(true)
    Promise.all([listarConteudos(), listarCategorias()])
      .then(([a, c]) => { setItens(a); setCategorias(c) })
      .catch((e) => setErro(e.message))
      .finally(() => setCarregando(false))
  }
  useEffect(carregar, [])

  function abrir(item = null) {
    setEditando(item?.id || null)
    setForm(item ? {
      titulo: item.titulo || '', descricao: item.descricao || '', conteudo: item.conteudo || '',
      imagem: item.imagem || '', categoriaId: item.categoria_id || ''
    } : vazio)
    setErroForm('')
    setAberto(true)
  }

  function change(e) { setForm(v => ({ ...v, [e.target.name]: e.target.value })) }

  async function submit(e) {
    e.preventDefault()
    if (!form.titulo.trim() || !form.descricao.trim() || !form.conteudo.trim() || !form.categoriaId) {
      setErroForm('Preencha título, descrição, conteúdo e categoria.')
      return
    }
    setSalvando(true); setErroForm('')
    try {
      if (editando) await atualizarConteudo(editando, form)
      else await criarConteudo(form)
      setAberto(false); carregar()
    } catch (e) { setErroForm(e.message) }
    finally { setSalvando(false) }
  }

  async function excluir(id) {
    if (!confirm('Excluir este conteúdo?')) return
    try { await excluirConteudo(id); carregar() } catch (e) { alert(e.message) }
  }

  return <div>
    <div className="admin__header">
      <h1>Conteúdos</h1>
      <Button variant="primary" onClick={() => aberto ? setAberto(false) : abrir()}> {aberto ? 'Cancelar' : 'Novo conteúdo'} </Button>
    </div>

    {aberto && <form className="admin__form" onSubmit={submit} noValidate>
      <h3>{editando ? 'Editar conteúdo' : 'Novo conteúdo'}</h3>
      {erroForm && <p className="form-message error">{erroForm}</p>}
      <Input id="titulo" name="titulo" label="Título" value={form.titulo} onChange={change} />
      <Input id="descricao" name="descricao" label="Descrição" value={form.descricao} onChange={change} />
      <Input id="conteudo" name="conteudo" as="textarea" rows={7} label="Conteúdo" value={form.conteudo} onChange={change} />
      <Input id="imagem" name="imagem" label="URL da imagem" value={form.imagem} onChange={change} />
      <div className="field"><label className="field__label" htmlFor="categoriaId">Categoria</label>
        <select id="categoriaId" name="categoriaId" className="field__control" value={form.categoriaId} onChange={change}>
          <option value="">Selecione...</option>{categorias.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
        </select>
      </div>
      <Button type="submit" variant="primary" disabled={salvando}>{salvando ? 'Salvando...' : 'Salvar conteúdo'}</Button>
    </form>}

    {carregando ? <Loading texto="Carregando conteúdos..." /> : erro ? <EmptyState titulo="Não foi possível carregar" descricao={erro} /> :
      itens.length === 0 ? <EmptyState titulo="Nenhum conteúdo cadastrado" /> :
      <div className="admin__table-wrap"><table className="admin__table"><thead><tr><th>Título</th><th>Categoria</th><th>Data</th><th>Ações</th></tr></thead>
        <tbody>{itens.map(i => <tr key={i.id}><td>{i.titulo}</td><td>{i.categoria_nome}</td><td>{formatarData(i.data_publicacao)}</td>
          <td className="admin__row-actions"><Button variant="ghost" size="sm" onClick={() => abrir(i)}>Editar</Button><Button variant="ghost" size="sm" onClick={() => excluir(i.id)}>Excluir</Button></td></tr>)}</tbody>
      </table></div>}
  </div>
}
