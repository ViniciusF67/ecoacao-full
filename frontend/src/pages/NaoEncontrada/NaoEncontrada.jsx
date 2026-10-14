import { Link } from 'react-router-dom'
import Button from '../../components/Button/Button.jsx'
import './NaoEncontrada.css'

export default function NaoEncontrada() {
  return (
    <div className="nao-encontrada">
      <div className="container nao-encontrada__inner">
        <span className="nao-encontrada__codigo" aria-hidden="true">404</span>
        <h1>Página não encontrada</h1>
        <p>O endereço que você tentou acessar não existe ou foi movido.</p>
        <Button as={Link} to="/" variant="primary" size="lg">Voltar para o início</Button>
      </div>
    </div>
  )
}
