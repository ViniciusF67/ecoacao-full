import './Input.css'

export default function Input({ label, id, error, as = 'input', className = '', ...props }) {
  const Tag = as
  return (
    <div className={`field ${error ? 'field--error' : ''} ${className}`}>
      {label && (
        <label htmlFor={id} className="field__label">
          {label}
        </label>
      )}
      <Tag id={id} className="field__control" {...props} />
      {error && (
        <span className="field__error" role="alert">
          {error}
        </span>
      )}
    </div>
  )
}
