import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Button from '../../components/Button/Button.jsx'
import NewsCard from '../../components/NewsCard/NewsCard.jsx'
import ContentCard from '../../components/ContentCard/ContentCard.jsx'
import ChallengeCard from '../../components/ChallengeCard/ChallengeCard.jsx'
import { listarNoticias } from '../../services/newsService.js'
import { listarConteudos } from '../../services/contentService.js'
import { listarDesafios } from '../../services/challengeService.js'
import './Home.css'

export default function Home() {
  const [ultimasNoticias, setUltimasNoticias] = useState([])
  const [destaquesConteudo, setDestaquesConteudo] = useState([])
  const [destaquesDesafios, setDestaquesDesafios] = useState([])

  useEffect(() => {
    listarNoticias().then((dados) => setUltimasNoticias(dados.slice(0, 3))).catch(() => setUltimasNoticias([]))
    listarConteudos().then((dados) => setDestaquesConteudo(dados.slice(0, 3))).catch(() => setDestaquesConteudo([]))
    listarDesafios().then((dados) => setDestaquesDesafios(dados.slice(0, 3))).catch(() => setDestaquesDesafios([]))
  }, [])

  return (
    <div className="home">
      {/* HERO */}
      <section className="hero">
        <div className="container hero__inner">
          <div className="hero__text">
            <span className="eyebrow" style={{ background: 'rgba(255,255,255,0.15)', color: 'var(--eco-white)' }}>
              ODS 13 · Ação Contra a Mudança Global do Clima
            </span>
            <h1>Educação e ação prática pelo clima começam aqui.</h1>
            <p>
              O ECOAÇÃO é uma plataforma educacional que reúne notícias, conteúdos, quizzes e
              desafios ambientais para ajudar estudantes, professores e cidadãos a entenderem — e
              agirem sobre — a crise climática.
            </p>
            <div className="hero__actions">
              <Button as={Link} to="/quiz" variant="secondary" size="lg">Fazer um quiz</Button>
              <Button as={Link} to="/sobre" variant="outline" size="lg">Conhecer o projeto</Button>
            </div>
          </div>
          <div className="hero__art" aria-hidden="true">
            <div className="hero__circle hero__circle--1" />
            <div className="hero__circle hero__circle--2" />
            <div className="hero__ring" />
          </div>
        </div>
      </section>

      {/* SOBRE RÁPIDO */}
      <section className="section">
        <div className="container">
          <div className="grid grid-3 home-intro">
            <div className="home-intro__item">
              <span className="home-intro__numero">01</span>
              <h3>Fique informado</h3>
              <p>Notícias atuais sobre clima, energia, água, reciclagem e biodiversidade, em linguagem acessível.</p>
            </div>
            <div className="home-intro__item">
              <span className="home-intro__numero">02</span>
              <h3>Aprenda na prática</h3>
              <p>Conteúdos educativos e quizzes que ajudam a transformar informação em conhecimento real.</p>
            </div>
            <div className="home-intro__item">
              <span className="home-intro__numero">03</span>
              <h3>Aja no seu dia a dia</h3>
              <p>Desafios ambientais simples para colocar a consciência climática em prática, dentro e fora da escola.</p>
            </div>
          </div>
        </div>
      </section>

      {/* NOTÍCIAS */}
      <section className="section section--tinted">
        <div className="container">
          <div className="section-header-row">
            <div>
              <span className="eyebrow">Notícias</span>
              <h2>O que está acontecendo pelo clima</h2>
            </div>
            <Link to="/noticias" className="section-header-row__link">Ver todas as notícias →</Link>
          </div>
          <div className="grid grid-3">
            {ultimasNoticias.map((n) => <NewsCard key={n.id} noticia={n} />)}
          </div>
        </div>
      </section>

      {/* CONTEÚDOS */}
      <section className="section">
        <div className="container">
          <div className="section-header-row">
            <div>
              <span className="eyebrow">Conteúdos educativos</span>
              <h2>Entenda os temas por trás da crise climática</h2>
            </div>
            <Link to="/conteudos" className="section-header-row__link">Ver todos os conteúdos →</Link>
          </div>
          <div className="grid grid-3">
            {destaquesConteudo.map((c) => <ContentCard key={c.id} conteudo={c} />)}
          </div>
        </div>
      </section>

      {/* QUIZ CTA */}
      <section className="quiz-cta">
        <div className="container quiz-cta__inner">
          <div>
            <h2>Quanto você sabe sobre sustentabilidade?</h2>
            <p>Teste seus conhecimentos em poucos minutos e descubra sua pontuação ao final.</p>
          </div>
          <Button as={Link} to="/quiz" variant="secondary" size="lg">Começar quiz</Button>
        </div>
      </section>

      {/* DESAFIOS */}
      <section className="section">
        <div className="container">
          <div className="section-header-row">
            <div>
              <span className="eyebrow">Desafios</span>
              <h2>Coloque a mão na massa</h2>
            </div>
            <Link to="/desafios" className="section-header-row__link">Ver todos os desafios →</Link>
          </div>
          <div className="grid grid-3">
            {destaquesDesafios.map((d) => <ChallengeCard key={d.id} desafio={d} />)}
          </div>
        </div>
      </section>

      {/* PARTICIPAÇÃO */}
      <section className="section">
        <div className="container">
          <div className="participate">
            <div>
              <h2>Faça parte do ECOAÇÃO</h2>
              <p>
                Crie sua conta para acompanhar seu progresso em quizzes e desafios, e construir,
                aos poucos, o hábito de agir pelo clima.
              </p>
            </div>
            <div className="hero__actions">
              <Button as={Link} to="/cadastro" variant="primary" size="lg">Criar conta gratuita</Button>
              <Button as={Link} to="/organizacoes" variant="ghost" size="lg">Conhecer organizações</Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
