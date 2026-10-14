import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Input from '../../components/Input/Input.jsx'
import Button from '../../components/Button/Button.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { alterarMinhaSenha } from '../../services/userService.js'
import './EditarPerfil.css'

export default function EditarPerfil() {
  const { usuario, atualizarPerfil } = useAuth()
  const navigate = useNavigate()

  const [nome, setNome] = useState(usuario.nome)
  const [foto, setFoto] = useState(usuario.foto ?? '')
  const [bio, setBio] = useState(usuario.bio ?? '')
  const [erros, setErros] = useState({})
  const [status, setStatus] = useState(null)
  const [salvando, setSalvando] = useState(false)

  const [senhaAtual, setSenhaAtual] = useState('')
  const [novaSenha, setNovaSenha] = useState('')
  const [confirmarNovaSenha, setConfirmarNovaSenha] = useState('')
  const [errosSenha, setErrosSenha] = useState({})
  const [statusSenha, setStatusSenha] = useState(null)
  const [trocandoSenha, setTrocandoSenha] = useState(false)

  function validarPerfil() {
    const novosErros = {}
    if (!nome.trim()) novosErros.nome = 'Informe seu nome.'
    return novosErros
  }

  async function handleSubmitPerfil(e) {
    e.preventDefault()
    const novosErros = validarPerfil()
    setErros(novosErros)
    if (Object.keys(novosErros).length > 0) {
      setStatus(null)
      return
    }

    setSalvando(true)
    const resultado = await atualizarPerfil({ nome: nome.trim(), foto: foto.trim() || null, bio: bio.trim() })
    setSalvando(false)

    if (!resultado.ok) {
      setStatus('erro')
      setErros({ geral: resultado.erro })
      return
    }
    setStatus('sucesso')
  }

  function validarSenha() {
    const novosErros = {}
    if (!senhaAtual) novosErros.senhaAtual = 'Informe sua senha atual.'
    if (!novaSenha) {
      novosErros.novaSenha = 'Informe a nova senha.'
    } else if (novaSenha.length < 6) {
      novosErros.novaSenha = 'A nova senha deve ter ao menos 6 caracteres.'
    }
    if (novaSenha !== confirmarNovaSenha) novosErros.confirmarNovaSenha = 'As senhas não coincidem.'
    return novosErros
  }

  async function handleSubmitSenha(e) {
    e.preventDefault()
    const novosErros = validarSenha()
    setErrosSenha(novosErros)
    if (Object.keys(novosErros).length > 0) {
      setStatusSenha(null)
      return
    }

    setTrocandoSenha(true)
    try {
      await alterarMinhaSenha({ senhaAtual, novaSenha })
      setStatusSenha('sucesso')
      setSenhaAtual('')
      setNovaSenha('')
      setConfirmarNovaSenha('')
    } catch (err) {
      setStatusSenha('erro')
      setErrosSenha({ geral: err.message })
    } finally {
      setTrocandoSenha(false)
    }
  }

  return (
    <div className="section">
      <div className="container editar-perfil">
        <span className="eyebrow">Editar perfil</span>
        <h1>Atualize suas informações</h1>

        {status === 'sucesso' && <p className="form-message success">Perfil atualizado com sucesso!</p>}
        {status === 'erro' && <p className="form-message error">{erros.geral}</p>}

        <form className="editar-perfil__form" onSubmit={handleSubmitPerfil} noValidate>
          <Input
            id="nome"
            label="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            error={erros.nome}
          />
          <Input
            id="foto"
            label="URL da foto de perfil (opcional)"
            placeholder="https://..."
            value={foto}
            onChange={(e) => setFoto(e.target.value)}
          />
          <Input
            id="bio"
            as="textarea"
            rows={4}
            label="Bio"
            placeholder="Conte um pouco sobre você..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />

          <div className="editar-perfil__acoes">
            <Button type="submit" variant="primary" size="lg" disabled={salvando}>
              {salvando ? 'Salvando...' : 'Salvar alterações'}
            </Button>
            <Button type="button" variant="ghost" size="lg" onClick={() => navigate('/perfil')}>
              Cancelar
            </Button>
          </div>
        </form>

        <form className="editar-perfil__form" onSubmit={handleSubmitSenha} noValidate style={{ marginTop: 'var(--space-6)' }}>
          <h3>Alterar senha</h3>
          <p className="editar-perfil__hint">Por segurança, informe sua senha atual para definir uma nova.</p>

          {statusSenha === 'sucesso' && <p className="form-message success">Senha alterada com sucesso!</p>}
          {statusSenha === 'erro' && <p className="form-message error">{errosSenha.geral}</p>}

          <Input
            id="senhaAtual"
            type="password"
            label="Senha atual"
            value={senhaAtual}
            onChange={(e) => setSenhaAtual(e.target.value)}
            error={errosSenha.senhaAtual}
          />
          <Input
            id="novaSenha"
            type="password"
            label="Nova senha"
            value={novaSenha}
            onChange={(e) => setNovaSenha(e.target.value)}
            error={errosSenha.novaSenha}
          />
          <Input
            id="confirmarNovaSenha"
            type="password"
            label="Confirmar nova senha"
            value={confirmarNovaSenha}
            onChange={(e) => setConfirmarNovaSenha(e.target.value)}
            error={errosSenha.confirmarNovaSenha}
          />

          <Button type="submit" variant="secondary" size="lg" disabled={trocandoSenha}>
            {trocandoSenha ? 'Alterando...' : 'Alterar senha'}
          </Button>
        </form>
      </div>
    </div>
  )
}
