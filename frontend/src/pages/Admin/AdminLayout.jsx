import { NavLink, Outlet } from 'react-router-dom'
import './Admin.css'

const links = [
  { to: '/admin', label: 'Visão geral', end: true },
  { to: '/admin/noticias', label: 'Notícias' },
  { to: '/admin/conteudos', label: 'Conteúdos' },
  { to: '/admin/desafios', label: 'Desafios' },
  { to: '/admin/organizacoes', label: 'Organizações' },
  { to: '/admin/quizzes', label: 'Quizzes' },
  { to: '/admin/categorias', label: 'Categorias' },
  { to: '/admin/usuarios', label: 'Usuários' },
]

export default function AdminLayout() {
  return (
    <div className="admin">
      <div className="container admin__layout">
        <aside className="admin__sidebar">
          <span className="eyebrow">Painel administrativo</span>
          <nav className="admin__nav">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) => `admin__nav-link ${isActive ? 'is-active' : ''}`}
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <div className="admin__content">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
