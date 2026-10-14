import { useEffect, useState } from 'react'
import Button from '../../components/Button/Button.jsx'
import Input from '../../components/Input/Input.jsx'
import Loading from '../../components/Loading/Loading.jsx'
import EmptyState from '../../components/EmptyState/EmptyState.jsx'
import { listarQuizzes, criarQuiz, excluirQuiz } from '../../services/quizService.js'
import { listarCategorias } from '../../services/categoryService.js'

const novaPergunta=()=>({enunciado:'',alternativas:[{texto:'',correta:true},{texto:'',correta:false},{texto:'',correta:false},{texto:'',correta:false}]})

export default function AdminQuizzes(){
 const [itens,setItens]=useState([]),[categorias,setCategorias]=useState([]),[carregando,setCarregando]=useState(true),[erro,setErro]=useState('')
 const [aberto,setAberto]=useState(false),[form,setForm]=useState({titulo:'',descricao:'',categoriaId:'',perguntas:[novaPergunta()]}),[salvando,setSalvando]=useState(false),[erroForm,setErroForm]=useState('')
 function carregar(){setCarregando(true);Promise.all([listarQuizzes(),listarCategorias()]).then(([q,c])=>{setItens(q);setCategorias(c)}).catch(e=>setErro(e.message)).finally(()=>setCarregando(false))}
 useEffect(carregar,[])
 function addPergunta(){setForm(f=>({...f,perguntas:[...f.perguntas,novaPergunta()]}))}
 function removePergunta(i){setForm(f=>({...f,perguntas:f.perguntas.filter((_,x)=>x!==i)}))}
 function changePergunta(i,v){setForm(f=>({...f,perguntas:f.perguntas.map((p,x)=>x===i?{...p,enunciado:v}:p)}))}
 function changeAlt(pi,ai,v){setForm(f=>({...f,perguntas:f.perguntas.map((p,x)=>x===pi?{...p,alternativas:p.alternativas.map((a,y)=>y===ai?{...a,texto:v}:a)}:p)}))}
 function correta(pi,ai){setForm(f=>({...f,perguntas:f.perguntas.map((p,x)=>x===pi?{...p,alternativas:p.alternativas.map((a,y)=>({...a,correta:y===ai}))}:p)}))}
 async function submit(e){e.preventDefault();setErroForm('');if(!form.titulo.trim()||!form.categoriaId){setErroForm('Título e categoria são obrigatórios.');return}
  if(form.perguntas.some(p=>!p.enunciado.trim()||p.alternativas.some(a=>!a.texto.trim()))){setErroForm('Preencha todas as perguntas e alternativas.');return}
  setSalvando(true);try{await criarQuiz(form);setForm({titulo:'',descricao:'',categoriaId:'',perguntas:[novaPergunta()]});setAberto(false);carregar()}catch(e){setErroForm(e.message)}finally{setSalvando(false)}
 }
 async function excluir(id){if(!confirm('Excluir este quiz e suas perguntas?'))return;try{await excluirQuiz(id);carregar()}catch(e){alert(e.message)}}
 return <div><div className="admin__header"><h1>Quizzes</h1><Button variant="primary" onClick={()=>setAberto(v=>!v)}>{aberto?'Cancelar':'Novo quiz'}</Button></div>
 {aberto&&<form className="admin__form" onSubmit={submit} noValidate><h3>Novo quiz</h3>{erroForm&&<p className="form-message error">{erroForm}</p>}
 <Input id="titulo" name="titulo" label="Título" value={form.titulo} onChange={e=>setForm(f=>({...f,titulo:e.target.value}))}/><Input id="descricao" name="descricao" label="Descrição" value={form.descricao} onChange={e=>setForm(f=>({...f,descricao:e.target.value}))}/>
 <div className="field"><label className="field__label" htmlFor="categoriaId">Categoria</label><select id="categoriaId" className="field__control" value={form.categoriaId} onChange={e=>setForm(f=>({...f,categoriaId:e.target.value}))}><option value="">Selecione...</option>{categorias.map(c=><option key={c.id} value={c.id}>{c.nome}</option>)}</select></div>
 {form.perguntas.map((p,pi)=><div key={pi} className="admin__form" style={{marginBottom:'var(--space-4)',border:'1px solid var(--eco-gray-100)'}}><div className="admin__header"><h3>Pergunta {pi+1}</h3>{form.perguntas.length>1&&<Button type="button" variant="ghost" size="sm" onClick={()=>removePergunta(pi)}>Remover</Button>}</div>
 <Input id={`pergunta-${pi}`} label="Enunciado" value={p.enunciado} onChange={e=>changePergunta(pi,e.target.value)}/>
 {p.alternativas.map((a,ai)=><div key={ai} style={{display:'grid',gridTemplateColumns:'1fr auto',gap:'var(--space-2)',alignItems:'end'}}><Input id={`alt-${pi}-${ai}`} label={`Alternativa ${ai+1}`} value={a.texto} onChange={e=>changeAlt(pi,ai,e.target.value)}/><label style={{fontSize:'var(--fs-xs)',paddingBottom:'var(--space-3)'}}><input type="radio" name={`correta-${pi}`} checked={a.correta} onChange={()=>correta(pi,ai)}/> Correta</label></div>)}
 </div>)}
 <div className="admin__row-actions"><Button type="button" variant="ghost" onClick={addPergunta}>Adicionar pergunta</Button><Button type="submit" variant="primary" disabled={salvando}>{salvando?'Salvando...':'Criar quiz'}</Button></div>
 </form>}
 {carregando?<Loading texto="Carregando quizzes..."/>:erro?<EmptyState titulo="Não foi possível carregar" descricao={erro}/>:itens.length===0?<EmptyState titulo="Nenhum quiz cadastrado"/>:
 <div className="admin__table-wrap"><table className="admin__table"><thead><tr><th>Título</th><th>Categoria</th><th>Perguntas</th><th>Ações</th></tr></thead><tbody>{itens.map(i=><tr key={i.id}><td>{i.titulo}</td><td>{i.categoria_nome}</td><td>{i.total_perguntas}</td><td><Button variant="ghost" size="sm" onClick={()=>excluir(i.id)}>Excluir</Button></td></tr>)}</tbody></table></div>}
 </div>
}
