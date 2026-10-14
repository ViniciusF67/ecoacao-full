import { useState } from 'react'
import Input from '../../components/Input/Input.jsx'
import Button from '../../components/Button/Button.jsx'
import { enviarMensagemContato } from '../../services/contactService.js'
import './Contato.css'

const valoresIniciais = { nome: '', email: '', assunto: '', mensagem: '' }

export default function Contato() {
  const [valores, setValores] = useState(valoresIniciais)
  const [erros, setErros] = useState({})
  const [status, setStatus] = useState(null) // null | 'sucesso' | 'erro'
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
    if (!valores.assunto.trim()) novosErros.assunto = 'Informe o assunto.'
    if (!valores.mensagem.trim()) novosErros.mensagem = 'Escreva sua mensagem.'
    else if (valores.mensagem.trim().length < 10) novosErros.mensagem = 'Sua mensagem deve ter ao menos 10 caracteres.'
    return novosErros
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const novosErros = validar()
    setErros(novosErros)
    if (Object.keys(novosErros).length > 0) {
      setStatus(null)
      return
    }

    setEnviando(true)
    try {
      await enviarMensagemContato(valores)
      setStatus('sucesso')
      setValores(valoresIniciais)
      setErros({})
    } catch (err) {
      setStatus('erro')
      setErros({ geral: err.message })
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div>
      <header className="page-header">
        <div className="container">
          <span className="eyebrow" style={{ background: 'rgba(255,255,255,0.15)', color: 'var(--eco-white)' }}>
            Contato
          </span>
          <h1>Fale com o ECOAÇÃO</h1>
          <p>Dúvidas, sugestões ou parcerias? Envie sua mensagem pelo formulário abaixo.</p>
        </div>
      </header>

      <section className="section">
        <div className="container contato-grid">
          <form className="contato-form" onSubmit={handleSubmit} noValidate>
            {status === 'sucesso' && (
              <p className="form-message success">Mensagem enviada com sucesso! Em breve entraremos em contato.</p>
            )}
            {status === 'erro' && (
              <p className="form-message error">{erros.geral || 'Não foi possível enviar sua mensagem.'}</p>
            )}

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
              id="assunto"
              name="assunto"
              label="Assunto"
              placeholder="Sobre o que você quer falar?"
              value={valores.assunto}
              onChange={handleChange}
              error={erros.assunto}
            />
            <Input
              id="mensagem"
              name="mensagem"
              as="textarea"
              rows={5}
              label="Mensagem"
              placeholder="Escreva sua mensagem..."
              value={valores.mensagem}
              onChange={handleChange}
              error={erros.mensagem}
            />

            <Button type="submit" variant="primary" size="lg" disabled={enviando}>
              {enviando ? 'Enviando...' : 'Enviar mensagem'}
            </Button>
          </form>

          <aside className="contato-info">
            <h3>Outros canais</h3>
            <ul className="contato-info__list">
              <li><strong>E-mail:</strong> contato@ecoacao.edu.br</li>
              <li><strong>Projeto:</strong> Trabalho escolar de Informática</li>
              <li><strong>Tema:</strong> ODS 13 — Ação Contra a Mudança Global do Clima</li>
            </ul>
            <p className="contato-info__nota">
              Este formulário está preparado para, futuramente, enviar as mensagens a uma API
              Node/Express que as armazenará em um banco PostgreSQL.
            </p>
          </aside>
        </div>
      </section>
    </div>
  )
}
