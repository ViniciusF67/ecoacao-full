import { useEffect, useState } from 'react'
import Button from '../../components/Button/Button.jsx'
import Input from '../../components/Input/Input.jsx'
import Loading from '../../components/Loading/Loading.jsx'
import EmptyState from '../../components/EmptyState/EmptyState.jsx'
import { listarCategorias, criarCategoria, excluirCategoria } from '../../services/categoryService.js'

export default function AdminCategorias() {
  const [categorias, setCategorias] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  const [nome, setNome] = useState('')
  const [descricao, setDescricao] = useState('')
  const [salvando, setSalvando] = useState(false)
  const [erroForm, setErroForm] = useState('')

  function carregar() {
    setCarregando(true)
    listarCategorias()
      .then(setCategorias)
      .catch((err) => setErro(err.message))
      .finally(() => setCarregando(false))
  }

  useEffect(carregar, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setErroForm('')
    if (!nome.trim()) {
      setErroForm('Informe o nome da categoria.')
      return
    }
    setSalvando(true)
    try {
      await criarCategoria({ nome: nome.trim(), descricao: descricao.trim() })
      setNome('')
      setDescricao('')
      carregar()
    } catch (err) {
      setErroForm(err.message)
    } finally {
      setSalvando(false)
    }
  }

  async function handleExcluir(id) {
    if (!confirm('Excluir esta categoria? Notícias, conteúdos e desafios vinculados a ela serão afetados.')) return
    try {
      await excluirCategoria(id)
      carregar()
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div>
      <div className="admin__header">
        <h1>Categorias</h1>
      </div>

      <form className="admin__form" onSubmit={handleSubmit} noValidate>
        <h3>Nova categoria</h3>
        {erroForm && <p className="form-message error">{erroForm}</p>}
        <Input id="nome" label="Nome" value={nome} onChange={(e) => setNome(e.target.value)} />
        <Input id="descricao" label="Descrição" value={descricao} onChange={(e) => setDescricao(e.target.value)} />
        <Button type="submit" variant="primary" disabled={salvando}>
          {salvando ? 'Salvando...' : 'Adicionar categoria'}
        </Button>
      </form>

      {carregando ? (
        <Loading texto="Carregando categorias..." />
      ) : erro ? (
        <EmptyState titulo="Não foi possível carregar" descricao={erro} />
      ) : categorias.length === 0 ? (
        <EmptyState titulo="Nenhuma categoria cadastrada" />
      ) : (
        <div className="admin__table-wrap">
          <table className="admin__table">
            <thead>
              <tr><th>Nome</th><th>Descrição</th><th>Ações</th></tr>
            </thead>
            <tbody>
              {categorias.map((c) => (
                <tr key={c.id}>
                  <td>{c.nome}</td>
                  <td>{c.descricao}</td>
                  <td><Button variant="ghost" size="sm" onClick={() => handleExcluir(c.id)}>Excluir</Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
