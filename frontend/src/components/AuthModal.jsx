import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { authAPI } from '../services/api'

export default function AuthModal({ mode, onClose }) {
  const [tab,     setTab]     = useState(mode || 'login')
  const [form,    setForm]    = useState({ name: '', email: '', phone: '', password: '' })
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const submit = async e => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      if (tab === 'login') {
        try {
          const res = await authAPI.login({ email: form.email, password: form.password })
          login(res.data.user, res.data.token)
        } catch {
          // Demo fallback
          login({ id: '1', name: form.email.split('@')[0], email: form.email, phone: '9999999999' }, 'demo_token')
        }
      } else {
        try {
          const res = await authAPI.register(form)
          login(res.data.user, res.data.token)
        } catch {
          login({ id: '1', name: form.name, email: form.email, phone: form.phone }, 'demo_token')
        }
      }
      onClose()
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={s.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={s.modal}>
        <button style={s.close} onClick={onClose}>✕</button>

        <div style={s.tabs}>
          {['login', 'register'].map(t => (
            <button key={t} style={{ ...s.tab, ...(tab === t ? s.tabActive : {}) }} onClick={() => setTab(t)}>
              {t === 'login' ? 'Log In' : 'Sign Up'}
            </button>
          ))}
        </div>

        <div style={s.title}>{tab === 'login' ? '👋 Welcome Back' : '🚗 Join DriveIndia'}</div>
        <div style={s.sub}>{tab === 'login' ? 'Log in to your account' : 'Create your free account'}</div>

        <form onSubmit={submit} style={s.form}>
          {tab === 'register' && (
            <>
              <Field label="Full Name"     name="name"  placeholder="Rahul Sharma"     value={form.name}  onChange={handle} />
              <Field label="Phone Number"  name="phone" placeholder="+91 9876543210"   value={form.phone} onChange={handle} type="tel" />
            </>
          )}
          <Field label="Email"    name="email"    type="email"    placeholder="rahul@email.com" value={form.email}    onChange={handle} />
          <Field label="Password" name="password" type="password" placeholder="••••••••"        value={form.password} onChange={handle} />

          {error && <div style={s.error}>⚠️ {error}</div>}

          <button type="submit" style={s.btnSubmit} disabled={loading}>
            {loading ? '⏳ Please wait...' : tab === 'login' ? '→ Log In' : '→ Create Account'}
          </button>
        </form>

        <div style={s.switch}>
          {tab === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <span style={s.switchLink} onClick={() => setTab(tab === 'login' ? 'register' : 'login')}>
            {tab === 'login' ? 'Sign Up Free' : 'Log In'}
          </span>
        </div>

        <div style={s.demo}>🔒 Demo mode — works without backend</div>
      </div>
    </div>
  )
}

function Field({ label, name, type = 'text', placeholder, value, onChange }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--text-dim)' }}>{label}</label>
      <input name={name} type={type} placeholder={placeholder} value={value} onChange={onChange} required
        style={{ background: 'var(--dark3)', border: '1px solid var(--border)', borderRadius: 8, padding: '11px 14px', color: 'var(--white)', fontSize: 14, outline: 'none' }}
        onFocus={e => e.target.style.borderColor = 'var(--saffron)'}
        onBlur={e  => e.target.style.borderColor = 'var(--border)'}
      />
    </div>
  )
}

const s = {
  overlay: { position: 'fixed', inset: 0, zIndex: 500, background: 'rgba(0,0,0,.85)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, animation: 'fadeIn .2s ease' },
  modal:   { background: 'var(--dark2)', border: '1px solid var(--border)', borderRadius: 20, padding: '36px', width: '100%', maxWidth: 440, position: 'relative', animation: 'fadeUp .3s ease' },
  close:   { position: 'absolute', top: 16, right: 16, width: 30, height: 30, borderRadius: '50%', background: 'var(--dark3)', border: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: 14 },
  tabs:    { display: 'flex', gap: 4, background: 'var(--dark3)', borderRadius: 10, padding: 4, marginBottom: 24 },
  tab:     { flex: 1, padding: '8px', borderRadius: 7, border: 'none', background: 'transparent', color: 'var(--text-muted)', fontSize: 13, fontWeight: 500 },
  tabActive:{ background: 'var(--saffron)', color: 'white', fontWeight: 600 },
  title:   { fontFamily: "'Syne',sans-serif", fontSize: 22, fontWeight: 800, color: 'var(--white)', marginBottom: 4 },
  sub:     { fontSize: 13, color: 'var(--text-muted)', marginBottom: 24 },
  form:    { display: 'flex', flexDirection: 'column', gap: 14 },
  error:   { padding: '10px 14px', background: 'rgba(239,68,68,.1)', border: '1px solid rgba(239,68,68,.25)', borderRadius: 8, fontSize: 13, color: '#EF4444' },
  btnSubmit:{ marginTop: 6, padding: '13px', background: 'var(--saffron)', color: 'white', border: 'none', borderRadius: 10, fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 15 },
  switch:  { fontSize: 13, color: 'var(--text-muted)', textAlign: 'center', marginTop: 18 },
  switchLink:{ color: 'var(--saffron)', cursor: 'pointer', fontWeight: 600 },
  demo:    { fontSize: 11, color: 'var(--text-dim)', textAlign: 'center', marginTop: 12, padding: '8px', background: 'var(--dark3)', borderRadius: 6 },
}
