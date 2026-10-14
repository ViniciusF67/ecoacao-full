import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Input from '../../components/Input/Input.jsx'
import Button from '../../components/Button/Button.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import './Auth.css'

const valoresIniciais = { nome: '', email: '', senha: '', confirmarSenha: '' }

export default function Cadastro() {
  const { cadastrar } = useAuth()
  const navigate = useNavigate()

  const [valores, setValores] = useState(valoresIniciais)
  const [erros, setErros] = useState({})
  const [erroGeral, setErroGeral] = useState('')
  const [enviando, setEnviando] = useState(false)

  function handleChange(e) {
    const { name, value } = e.target
    setValores((v) => ({ ...v, [name]: value }))
  }

  function validar() {
    const novosErros = {}
    if (!valores.nome.trim()) novosErros.nome = 'Informe seu nome.'
    if (!valores.email.trim()) {
      novosErros.email = 'Informe seu e-mail.'
    } else if (!/^\S+@\S+\.\S+$/.test(valores.email)) {
      novosErros.email = 'Informe um e-mail válido.'
    }
    if (!valores.senha) {
      novosErros.senha = 'Crie uma senha.'
    } else if (valores.senha.length < 6) {
      novosErros.senha = 'A senha deve ter ao menos 6 caracteres.'
    }
    if (valores.confirmarSenha !== valores.senha) {
      novosErros.confirmarSenha = 'As senhas não coincidem.'
    }
    return novosErros
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErroGeral('')
    const novosErros = validar()
    setErros(novosErros)
    if (Object.keys(novosErros).length > 0) return

    setEnviando(true)
    // "confirmarSenha" NUNCA é enviado à API — existe só para validação local.
    const { nome, email, senha } = valores
    const resultado = await cadastrar({ nome, email, senha })
    setEnviando(false)

    if (!resultado.ok) {
      setErroGeral(resultado.erro)
      return
    }
    navigate('/perfil', { replace: true })
  }

  return (
    <div className="auth-page">
      <div className="container auth-page__inner">
        <div className="auth-card">
          <span className="eyebrow">Criar conta</span>
          <h1>Junte-se ao ECOAÇÃO</h1>
          <p className="auth-card__subtitle">Crie sua conta para participar de quizzes e desafios.</p>

          {erroGeral && <p className="form-message error">{erroGeral}</p>}

          <form onSubmit={handleSubmit} noValidate>
            <Input
              id="nome"
              name="nome"
              label="Nome"
              placeholder="Seu nome completo"
              value={valores.nome}
              onChange={handleChange}
              error={erros.nome}
            />
            <Input
              id="email"
              name="email"
              type="email"
              label="E-mail"
              placeholder="seu@email.com"
              value={valores.email}
              onChange={handleChange}
              error={erros.email}
            />
            <Input
              id="senha"
              name="senha"
              type="password"
              label="Senha"
              placeholder="Mínimo de 6 caracteres"
              value={valores.senha}
              onChange={handleChange}
              error={erros.senha}
            />
            <Input
              id="confirmarSenha"
              name="confirmarSenha"
              type="password"
              label="Confirmar senha"
              placeholder="Repita a senha"
              value={valores.confirmarSenha}
              onChange={handleChange}
              error={erros.confirmarSenha}
            />

            <Button type="submit" variant="primary" size="lg" disabled={enviando} className="auth-card__submit">
              {enviando ? 'Criando conta...' : 'Criar conta'}
            </Button>
          </form>

          <p className="auth-card__footer">
            Já tem uma conta? <Link to="/login">Entrar</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
