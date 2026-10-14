import { useEffect, useState } from 'react'
import Button from '../../components/Button/Button.jsx'
import Input from '../../components/Input/Input.jsx'
import Loading from '../../components/Loading/Loading.jsx'
import EmptyState from '../../components/EmptyState/EmptyState.jsx'
import { listarOrganizacoes, criarOrganizacao, atualizarOrganizacao, excluirOrganizacao } from '../../services/organizationService.js'
import { listarCategorias } from '../../services/categoryService.js'

const vazio={nome:'',descricao:'',logo:'',categoriaId:'',email:'',telefone:'',site:'',endereco:''}

export default function AdminOrganizacoes(){
 const [itens,setItens]=useState([]),[categorias,setCategorias]=useState([]),[carregando,setCarregando]=useState(true),[erro,setErro]=useState('')
 const [form,setForm]=useState(vazio),[editando,setEditando]=useState(null),[aberto,setAberto]=useState(false),[salvando,setSalvando]=useState(false),[erroForm,setErroForm]=useState('')
 function carregar(){setCarregando(true);Promise.all([listarOrganizacoes(),listarCategorias()]).then(([o,c])=>{setItens(o);setCategorias(c)}).catch(e=>setErro(e.message)).finally(()=>setCarregando(false))}
 useEffect(carregar,[])
 function abrir(i=null){setEditando(i?.id||null);setForm(i?{nome:i.nome||'',descricao:i.descricao||'',logo:i.logo||'',categoriaId:i.categoria_id||'',email:i.email||'',telefone:i.telefone||'',site:i.site||'',endereco:i.endereco||''}:vazio);setErroForm('');setAberto(true)}
 function change(e){setForm(v=>({...v,[e.target.name]:e.target.value}))}
 async function submit(e){e.preventDefault();if(!form.nome.trim()||!form.descricao.trim()||!form.categoriaId){setErroForm('Preencha nome, descrição e categoria.');return}setSalvando(true);setErroForm('');try{if(editando)await atualizarOrganizacao(editando,form);else await criarOrganizacao(form);setAberto(false);carregar()}catch(e){setErroForm(e.message)}finally{setSalvando(false)}}
 async function excluir(id){if(!confirm('Excluir esta organização?'))return;try{await excluirOrganizacao(id);carregar()}catch(e){alert(e.message)}}
 return <div><div className="admin__header"><h1>Organizações</h1><Button variant="primary" onClick={()=>aberto?setAberto(false):abrir()}>{aberto?'Cancelar':'Nova organização'}</Button></div>
 {aberto&&<form className="admin__form" onSubmit={submit} noValidate><h3>{editando?'Editar organização':'Nova organização'}</h3>{erroForm&&<p className="form-message error">{erroForm}</p>}
 <Input id="nome" name="nome" label="Nome" value={form.nome} onChange={change}/><Input id="descricao" name="descricao" label="Descrição" value={form.descricao} onChange={change}/><Input id="logo" name="logo" label="URL do logo" value={form.logo} onChange={change}/>
 <div className="field"><label className="field__label" htmlFor="categoriaId">Categoria</label><select id="categoriaId" name="categoriaId" className="field__control" value={form.categoriaId} onChange={change}><option value="">Selecione...</option>{categorias.map(c=><option key={c.id} value={c.id}>{c.nome}</option>)}</select></div>
 <Input id="email" name="email" label="E-mail" value={form.email} onChange={change}/><Input id="telefone" name="telefone" label="Telefone" value={form.telefone} onChange={change}/><Input id="site" name="site" label="Site" value={form.site} onChange={change}/><Input id="endereco" name="endereco" label="Endereço" value={form.endereco} onChange={change}/>
 <Button type="submit" variant="primary" disabled={salvando}>{salvando?'Salvando...':'Salvar organização'}</Button></form>}
 {carregando?<Loading texto="Carregando organizações..."/>:erro?<EmptyState titulo="Não foi possível carregar" descricao={erro}/>:itens.length===0?<EmptyState titulo="Nenhuma organização cadastrada"/>:
 <div className="admin__table-wrap"><table className="admin__table"><thead><tr><th>Nome</th><th>Categoria</th><th>Site</th><th>Ações</th></tr></thead><tbody>{itens.map(i=><tr key={i.id}><td>{i.nome}</td><td>{i.categoria_nome}</td><td>{i.site||'—'}</td><td className="admin__row-actions"><Button variant="ghost" size="sm" onClick={()=>abrir(i)}>Editar</Button><Button variant="ghost" size="sm" onClick={()=>excluir(i.id)}>Excluir</Button></td></tr>)}</tbody></table></div>}
 </div>
}
