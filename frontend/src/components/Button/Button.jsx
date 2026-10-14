import './Button.css'

/**
 * Botão reutilizável.
 * variant: 'primary' | 'secondary' | 'ghost' | 'outline'
 * size: 'sm' | 'md' | 'lg'
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  as: Component = 'button',
  className = '',
  ...props
}) {
  const classes = `btn btn--${variant} btn--${size} ${className}`.trim()
  return (
    <Component className={classes} {...props}>
      {children}
    </Component>
  )
}
