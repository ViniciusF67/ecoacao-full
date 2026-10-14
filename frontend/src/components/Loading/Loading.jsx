import './Loading.css'

export default function Loading({ texto = 'Carregando...' }) {
  return (
    <div className="loading" role="status" aria-live="polite">
      <span className="loading__spinner" aria-hidden="true" />
      <span>{texto}</span>
    </div>
  )
}
