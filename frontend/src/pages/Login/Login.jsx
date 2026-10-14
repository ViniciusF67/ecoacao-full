import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import Input from '../../components/Input/Input.jsx'
import Button from '../../components/Button/Button.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import './Auth.css'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const destino = location.state?.de || '/perfil'

  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')

    if (!email.trim() || !senha.trim()) {
      setErro('Preencha e-mail e senha.')
      return
    }

    setEnviando(true)
    const resultado = await login(email, senha)
    setEnviando(false)

    if (!resultado.ok) {
      setErro(resultado.erro)
      return
    }
    navigate(destino, { replace: true })
  }

  return (
    <div className="auth-page">
      <div className="container auth-page__inner">
        <div className="auth-card">
          <span className="eyebrow">Entrar</span>
          <h1>Bem-vindo(a) de volta</h1>
          <p className="auth-card__subtitle">Acesse sua conta para acompanhar quizzes e desafios.</p>

          {erro && <p className="form-message error">{erro}</p>}

          <form onSubmit={handleSubmit} noValidate>
            <Input
              id="email"
              type="email"
              label="E-mail"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              id="senha"
              type="password"
              label="Senha"
              placeholder="Sua senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />

            <Link to="/login" className="auth-card__forgot" onClick={(e) => e.preventDefault()}>
              Esqueci minha senha
            </Link>

            <Button type="submit" variant="primary" size="lg" disabled={enviando} className="auth-card__submit">
              {enviando ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>

          <p className="auth-card__footer">
            Ainda não tem conta? <Link to="/cadastro">Criar conta</Link>
          </p>

          <p className="auth-card__demo">
            Dica: crie sua conta pela tela de cadastro, ou use o usuário administrador
            criado no <code>database/seed.sql</code> (e-mail <code>admin@ecoacao.com</code>,
            senha definida por quem rodou o seed — veja o README).
          </p>
        </div>
      </div>
    </div>
  )
}
