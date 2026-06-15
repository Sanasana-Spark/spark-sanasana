export default function KpiCard({ label, value, icon, color, chipColor, footer, footerType }) {
  return (
    <div className="kpi-card">
      <div className="kpi-bar" style={{ background: color }} />
      <div className="kpi-head">
        <span className="kpi-label">{label}</span>
        <div className="kpi-chip" style={{ background: chipColor }}>{icon}</div>
      </div>
      <div className="kpi-value">{value}</div>
      {footer && (
        <div className="kpi-footer">
          {footerType === 'up'   && <span className="trend-up">{footer}</span>}
          {footerType === 'down' && <span className="trend-dn">{footer}</span>}
          {footerType === 'neutral' && <span>{footer}</span>}
          {!footerType && <span>{footer}</span>}
        </div>
      )}
    </div>
  )
}
