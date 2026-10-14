import { Link } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
  const ano = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div>
          <p className="footer__brand">ECOAÇÃO</p>
          <p className="footer__desc">
            Projeto educacional de conscientização ambiental, desenvolvido em alinhamento com a
            ODS 13 — Ação Contra a Mudança Global do Clima.
          </p>
        </div>

        <div>
          <h4 className="footer__title">Navegue</h4>
          <ul className="footer__list">
            <li><Link to="/noticias">Notícias</Link></li>
            <li><Link to="/conteudos">Conteúdos educativos</Link></li>
            <li><Link to="/quiz">Quiz</Link></li>
            <li><Link to="/desafios">Desafios</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="footer__title">Institucional</h4>
          <ul className="footer__list">
            <li><Link to="/sobre">Sobre o ECOAÇÃO</Link></li>
            <li><Link to="/organizacoes">Organizações parceiras</Link></li>
            <li><Link to="/contato">Contato</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="footer__title">Conta</h4>
          <ul className="footer__list">
            <li><Link to="/login">Entrar</Link></li>
            <li><Link to="/cadastro">Criar conta</Link></li>
          </ul>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="container footer__bottom-inner">
          <span>© {ano} ECOAÇÃO — projeto escolar de informática.</span>
          <span>Alinhado à ODS 13 da Agenda 2030 (ONU)</span>
        </div>
      </div>
    </footer>
  )
}
