import './Sobre.css'

const pilares = [
  { titulo: 'Educação', texto: 'Conteúdos e quizzes que traduzem temas ambientais complexos em linguagem acessível.' },
  { titulo: 'Conscientização', texto: 'Notícias atualizadas que aproximam a crise climática do cotidiano das pessoas.' },
  { titulo: 'Participação', texto: 'Desafios práticos que convidam à ação individual e coletiva.' },
  { titulo: 'Conexão', texto: 'Espaço para conhecer organizações e empresas que atuam pela sustentabilidade.' },
]

export default function Sobre() {
  return (
    <div>
      <header className="page-header">
        <div className="container">
          <span className="eyebrow" style={{ background: 'rgba(255,255,255,0.15)', color: 'var(--eco-white)' }}>
            Sobre o projeto
          </span>
          <h1>O ECOAÇÃO</h1>
          <p>Um projeto escolar de informática que une tecnologia e educação ambiental.</p>
        </div>
      </header>

      <section className="section">
        <div className="container sobre-intro">
          <div>
            <h2>O que é o ECOAÇÃO?</h2>
            <p>
              O ECOAÇÃO é um projeto escolar de informática desenvolvido com o objetivo de aplicar
              conhecimentos técnicos de programação e design a uma causa real: a conscientização
              ambiental. Não se trata de uma organização não governamental, mas de uma plataforma
              educacional e funcional, criada para estudo e aprendizado.
            </p>
            <p>
              A proposta nasce da constatação de que grande parte da população ainda tem acesso
              limitado a informações claras e confiáveis sobre mudanças climáticas. O ECOAÇÃO busca
              preencher essa lacuna, reunindo notícias, conteúdos educativos, quizzes e desafios em
              um único ambiente digital.
            </p>
          </div>
          <div>
            <h2>Qual problema o projeto aborda?</h2>
            <p>
              As mudanças climáticas representam um dos maiores desafios do nosso tempo, afetando
              diretamente ecossistemas, economias e a qualidade de vida das pessoas. Ainda assim,
              informações sobre o tema costumam ser dispersas, técnicas demais ou pouco acessíveis
              ao público geral — especialmente estudantes.
            </p>
            <p>
              O ECOAÇÃO propõe reunir, em um só lugar, conteúdo confiável e interativo, incentivando
              não apenas a compreensão do problema, mas também pequenas ações práticas no dia a dia.
            </p>
          </div>
        </div>
      </section>

      <section className="section section--tinted">
        <div className="container">
          <div className="section-header">
            <span className="eyebrow">Nossos pilares</span>
            <h2>Como o ECOAÇÃO se propõe a ajudar</h2>
          </div>
          <div className="grid grid-4">
            {pilares.map((p, i) => (
              <div key={p.titulo} className="pilar-card">
                <span className="pilar-card__numero">{String(i + 1).padStart(2, '0')}</span>
                <h3>{p.titulo}</h3>
                <p>{p.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="ods-box">
            <div className="ods-box__badge">ODS 13</div>
            <div>
              <h2>Relação com a ODS 13 da Agenda 2030</h2>
              <p>
                A Organização das Nações Unidas (ONU) estabeleceu, na Agenda 2030, 17 Objetivos de
                Desenvolvimento Sustentável (ODS). A ODS 13 trata da Ação Contra a Mudança Global do
                Clima, reforçando a urgência de medidas educativas, políticas e práticas para reduzir
                os impactos do aquecimento global.
              </p>
              <p>
                O ECOAÇÃO se conecta diretamente a esse objetivo ao oferecer um espaço voltado à
                educação climática, à disseminação de informação de qualidade e ao incentivo de
                pequenas mudanças de comportamento que, somadas, contribuem para um impacto coletivo
                positivo.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container text-center">
          <h2>Por que a conscientização ambiental importa</h2>
          <p style={{ maxWidth: 680, margin: '0 auto' }}>
            Grande parte das mudanças necessárias para enfrentar a crise climática depende de
            decisões coletivas — de políticas públicas a hábitos de consumo. A conscientização é o
            primeiro passo para que cidadãos, estudantes, professores e empresas compreendam seu
            papel nesse processo e se sintam capazes de agir, ainda que por meio de pequenas atitudes
            cotidianas.
          </p>
        </div>
      </section>
    </div>
  )
}
