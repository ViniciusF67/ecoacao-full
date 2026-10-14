import { useState } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import './Navbar.css'

const links = [
  { to: '/', label: 'Início', end: true },
  { to: '/sobre', label: 'Sobre' },
  { to: '/noticias', label: 'Notícias' },
  { to: '/conteudos', label: 'Conteúdos' },
  { to: '/quiz', label: 'Quiz' },
  { to: '/desafios', label: 'Desafios' },
  { to: '/organizacoes', label: 'Organizações' },
  { to: '/contato', label: 'Contato' },
]

export default function Navbar() {
  const [aberto, setAberto] = useState(false)
  const { usuario, logout, isAdmin } = useAuth()
  const navigate = useNavigate()

  function fechar() {
    setAberto(false)
  }

  function sair() {
    logout()
    fechar()
    navigate('/')
  }

  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <Link to="/" className="navbar__brand" onClick={fechar}>
          ECOAÇÃO
        </Link>

        <button
          className="navbar__toggle"
          aria-label={aberto ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={aberto}
          onClick={() => setAberto((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`navbar__nav ${aberto ? 'is-open' : ''}`} aria-label="Navegação principal">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) => `navbar__link ${isActive ? 'is-active' : ''}`}
              onClick={fechar}
            >
              {l.label}
            </NavLink>
          ))}

          <div className="navbar__auth">
            {usuario ? (
              <>
                {isAdmin && (
                  <Link to="/admin" className="navbar__link" onClick={fechar}>
                    Painel admin
                  </Link>
                )}
                <Link to="/perfil" className="navbar__link navbar__link--user" onClick={fechar}>
                  Olá, {usuario.nome.split(' ')[0]}
                </Link>
                <button className="btn btn--ghost btn--sm" onClick={sair}>
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn--ghost btn--sm" onClick={fechar}>
                  Entrar
                </Link>
                <Link to="/cadastro" className="btn btn--primary btn--sm" onClick={fechar}>
                  Criar conta
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  )
}
