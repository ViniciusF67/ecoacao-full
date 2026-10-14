import { Link } from 'react-router-dom'
import Button from '../../components/Button/Button.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { formatarData } from '../../utils/formatarData.js'
import './Perfil.css'

export default function Perfil() {
  const { usuario, isAdmin } = useAuth()

  const iniciais = usuario.nome
    .split(' ')
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase()

  return (
    <div className="section">
      <div className="container perfil">
        <div className="perfil__card">
          <div className="perfil__avatar">
            {usuario.foto ? (
              <img src={usuario.foto} alt={usuario.nome} />
            ) : (
              <span>{iniciais}</span>
            )}
          </div>

          <div className="perfil__info">
            <div className="perfil__nome-row">
              <h1>{usuario.nome}</h1>
              {isAdmin && <span className="tag perfil__badge-admin">Administrador</span>}
            </div>
            <p className="perfil__email">{usuario.email}</p>
            {usuario.bio && <p className="perfil__bio">{usuario.bio}</p>}
            <p className="perfil__desde">Membro desde {formatarData(usuario.dataCadastro)}</p>

            <Button as={Link} to="/perfil/editar" variant="ghost">Editar perfil</Button>
          </div>
        </div>

        <div className="perfil__atividades">
          <h2>Minhas atividades</h2>
          <div className="grid grid-2">
            <div className="perfil__atividade-card">
              <div>
                <h3>Quizzes realizados</h3>
                <p>
                  Histórico dos seus quizzes, com pontuação e data de realização.
                </p>
              </div>
            </div>
            <div className="perfil__atividade-card">
              <div>
                <h3>Desafios concluídos</h3>
                <p>
                  Seus desafios em andamento e concluídos, com base no seu progresso salvo.
                </p>
              </div>
            </div>
          </div>
        </div>

        {isAdmin && (
          <div className="perfil__admin-aviso">
            <h3>Área administrativa</h3>
            <p>
              Sua conta possui papel de <strong>ADMIN</strong>. As ferramentas de gestão de
              notícias, conteúdos, desafios e usuários serão implementadas quando o backend
              Node/Express estiver disponível — a real validação de permissões deve sempre
              acontecer no servidor, nunca apenas no frontend.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
