import './EmptyState.css'

export default function EmptyState({ titulo = 'Nada por aqui ainda', descricao }) {
  return (
    <div className="empty-state">
      <div className="empty-state__mark" aria-hidden="true" />
      <h3>{titulo}</h3>
      {descricao && <p>{descricao}</p>}
    </div>
  )
}
