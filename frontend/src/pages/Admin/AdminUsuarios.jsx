import { useEffect, useState } from 'react'
import Loading from '../../components/Loading/Loading.jsx'
import EmptyState from '../../components/EmptyState/EmptyState.jsx'
import { listarUsuarios, alterarRoleDoUsuario, alterarStatusDoUsuario } from '../../services/userService.js'
import { listarRoles } from '../../services/adminService.js'
import { formatarData } from '../../utils/formatarData.js'
import { useAuth } from '../../context/AuthContext.jsx'

export default function AdminUsuarios() {
  const { usuario: usuarioLogado } = useAuth()
  const [usuarios, setUsuarios] = useState([])
  const [roles, setRoles] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  function carregar() {
    setCarregando(true)
    Promise.all([listarUsuarios(), listarRoles()])
      .then(([u, r]) => { setUsuarios(u); setRoles(r) })
      .catch((err) => setErro(err.message))
      .finally(() => setCarregando(false))
  }

  useEffect(carregar, [])

  async function handleAlterarRole(id, role) {
    try {
      await alterarRoleDoUsuario(id, role)
      carregar()
    } catch (err) {
      alert(err.message)
    }
  }

  async function handleAlterarStatus(id, status) {
    try {
      await alterarStatusDoUsuario(id, status)
      carregar()
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div>
      <div className="admin__header">
        <h1>Usuários</h1>
      </div>

      {carregando ? (
        <Loading texto="Carregando usuários..." />
      ) : erro ? (
        <EmptyState titulo="Não foi possível carregar" descricao={erro} />
      ) : (
        <div className="admin__table-wrap">
          <table className="admin__table">
            <thead>
              <tr><th>Nome</th><th>E-mail</th><th>Papel</th><th>Status</th><th>Cadastro</th></tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u.id}>
                  <td>{u.nome}{u.id === usuarioLogado.id && ' (você)'}</td>
                  <td>{u.email}</td>
                  <td>
                    <select
                      className="field__control"
                      value={u.role}
                      disabled={u.id === usuarioLogado.id}
                      onChange={(e) => handleAlterarRole(u.id, e.target.value)}
                    >
                      {roles.map((r) => <option key={r.id} value={r.nome}>{r.nome}</option>)}
                    </select>
                  </td>
                  <td>
                    <select
                      className="field__control"
                      value={u.status}
                      disabled={u.id === usuarioLogado.id}
                      onChange={(e) => handleAlterarStatus(u.id, e.target.value)}
                    >
                      <option value="ativo">ativo</option>
                      <option value="inativo">inativo</option>
                      <option value="banido">banido</option>
                    </select>
                  </td>
                  <td>{formatarData(u.data_cadastro)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
