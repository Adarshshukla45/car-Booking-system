export default function ToastContainer({ toasts = [], onRemove }) {
  if (!toasts.length) return null
  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 360 }}>
      {toasts.map(t => <Toast key={t.id} toast={t} onRemove={onRemove} />)}
    </div>
  )
}

function Toast({ toast, onRemove }) {
  const cfg = {
    success: { bg: '#0F2A1A', border: 'rgba(34,197,94,.3)',  color: '#22C55E', icon: '✅' },
    error:   { bg: '#2A0F0F', border: 'rgba(239,68,68,.3)',  color: '#EF4444', icon: '❌' },
    warning: { bg: '#2A1E00', border: 'rgba(245,197,24,.3)', color: '#F5C518', icon: '⚠️' },
    info:    { bg: '#0F1A2A', border: 'rgba(59,130,246,.3)', color: '#60A5FA', icon: 'ℹ️' },
  }[toast.type || 'success']

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', borderRadius: 12, background: cfg.bg, border: `1px solid ${cfg.border}`, boxShadow: '0 8px 32px rgba(0,0,0,.4)', animation: 'fadeUp .3s ease' }}>
      <span style={{ fontSize: 20 }}>{cfg.icon}</span>
      <span style={{ fontSize: 14, color: cfg.color, fontWeight: 500, flex: 1 }}>{toast.message}</span>
      <button style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,.3)', fontSize: 13, cursor: 'pointer' }} onClick={() => onRemove(toast.id)}>✕</button>
    </div>
  )
}
