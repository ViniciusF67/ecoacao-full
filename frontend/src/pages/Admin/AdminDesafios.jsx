import { useEffect, useState } from 'react'
import Button from '../../components/Button/Button.jsx'
import Input from '../../components/Input/Input.jsx'
import Loading from '../../components/Loading/Loading.jsx'
import EmptyState from '../../components/EmptyState/EmptyState.jsx'
import { listarDesafios, criarDesafio, atualizarDesafio, excluirDesafio } from '../../services/challengeService.js'
import { listarCategorias } from '../../services/categoryService.js'

const vazio = { titulo: '', descricao: '', instrucoes: '', imagem: '', categoriaId: '', dificuldade: 'Fácil' }

export default function AdminDesafios() {
  const [itens, setItens] = useState([]), [categorias, setCategorias] = useState([])
  const [carregando, setCarregando] = useState(true), [erro, setErro] = useState('')
  const [form, setForm] = useState(vazio), [editando, setEditando] = useState(null)
  const [aberto, setAberto] = useState(false), [salvando, setSalvando] = useState(false), [erroForm, setErroForm] = useState('')

  function carregar() { setCarregando(true); Promise.all([listarDesafios(), listarCategorias()])
    .then(([d,c]) => { setItens(d); setCategorias(c) }).catch(e => setErro(e.message)).finally(() => setCarregando(false)) }
  useEffect(carregar, [])
  function abrir(i=null) { setEditando(i?.id||null); setForm(i ? { titulo:i.titulo||'', descricao:i.descricao||'', instrucoes:i.instrucoes||'', imagem:i.imagem||'', categoriaId:i.categoria_id||'', dificuldade:i.dificuldade||'Fácil' } : vazio); setErroForm(''); setAberto(true) }
  function change(e) { setForm(v=>({...v,[e.target.name]:e.target.value})) }
  async function submit(e) {
    e.preventDefault()
    if (!form.titulo.trim() || !form.descricao.trim() || !form.instrucoes.trim() || !form.categoriaId) { setErroForm('Preencha título, descrição, instruções e categoria.'); return }
    setSalvando(true); setErroForm('')
    try { if(editando) await atualizarDesafio(editando,form); else await criarDesafio(form); setAberto(false); carregar() } catch(e) { setErroForm(e.message) } finally { setSalvando(false) }
  }
  async function excluir(id) { if(!confirm('Excluir este desafio?')) return; try { await excluirDesafio(id); carregar() } catch(e){alert(e.message)} }

  return <div><div className="admin__header"><h1>Desafios</h1><Button variant="primary" onClick={()=>aberto?setAberto(false):abrir()}>{aberto?'Cancelar':'Novo desafio'}</Button></div>
    {aberto && <form className="admin__form" onSubmit={submit} noValidate><h3>{editando?'Editar desafio':'Novo desafio'}</h3>{erroForm&&<p className="form-message error">{erroForm}</p>}
      <Input id="titulo" name="titulo" label="Título" value={form.titulo} onChange={change}/>
      <Input id="descricao" name="descricao" label="Descrição" value={form.descricao} onChange={change}/>
      <Input id="instrucoes" name="instrucoes" as="textarea" rows={6} label="Instruções" value={form.instrucoes} onChange={change}/>
      <Input id="imagem" name="imagem" label="URL da imagem" value={form.imagem} onChange={change}/>
      <div className="field"><label className="field__label" htmlFor="categoriaId">Categoria</label><select id="categoriaId" name="categoriaId" className="field__control" value={form.categoriaId} onChange={change}><option value="">Selecione...</option>{categorias.map(c=><option key={c.id} value={c.id}>{c.nome}</option>)}</select></div>
      <div className="field"><label className="field__label" htmlFor="dificuldade">Dificuldade</label><select id="dificuldade" name="dificuldade" className="field__control" value={form.dificuldade} onChange={change}><option>Fácil</option><option>Médio</option><option>Difícil</option></select></div>
      <Button type="submit" variant="primary" disabled={salvando}>{salvando?'Salvando...':'Salvar desafio'}</Button>
    </form>}
    {carregando?<Loading texto="Carregando desafios..."/>:erro?<EmptyState titulo="Não foi possível carregar" descricao={erro}/>:itens.length===0?<EmptyState titulo="Nenhum desafio cadastrado"/>:
      <div className="admin__table-wrap"><table className="admin__table"><thead><tr><th>Título</th><th>Categoria</th><th>Dificuldade</th><th>Ações</th></tr></thead><tbody>
        {itens.map(i=><tr key={i.id}><td>{i.titulo}</td><td>{i.categoria_nome}</td><td>{i.dificuldade}</td><td className="admin__row-actions"><Button variant="ghost" size="sm" onClick={()=>abrir(i)}>Editar</Button><Button variant="ghost" size="sm" onClick={()=>excluir(i.id)}>Excluir</Button></td></tr>)}
      </tbody></table></div>}
  </div>
}
