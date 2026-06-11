const CLASSES = {
  green:   'badge badge-green',
  amber:   'badge badge-amber',
  red:     'badge badge-red',
  blue:    'badge badge-blue',
  neutral: 'badge badge-neutral',
}

export default function Badge({ type = 'neutral', children, dot }) {
  return (
    <span className={CLASSES[type] || CLASSES.neutral}>
      {dot && <span className="badge-dot" />}
      {children}
    </span>
  )
}
