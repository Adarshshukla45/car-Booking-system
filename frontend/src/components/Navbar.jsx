import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar({ onAuthOpen }) {
  const { user, logout, isAuth } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const links = [
    { to: '/cars',    label: 'Cars'         },
    { to: '/#cities', label: 'Cities'       },
    { to: '/#how',    label: 'How It Works' },
    { to: '/#offers', label: 'Offers'       },
  ]

  return (
    <>
      <nav style={s.nav}>
        <Link to="/" style={s.logo}>
          <span style={s.dot} />
          Drive<span style={{ color: 'var(--saffron)' }}>India</span>
        </Link>

        <ul style={s.links}>
          {links.map(l => (
            <li key={l.to}>
              <Link to={l.to} style={{ ...s.link, color: location.pathname === l.to ? 'var(--white)' : 'var(--text-muted)' }}>
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div style={s.right}>
          {isAuth ? (
            <>
              <Link to="/dashboard" style={s.avatarRow}>
                <span style={s.avatar}>{user?.name?.[0]?.toUpperCase() || 'U'}</span>
                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{user?.name?.split(' ')[0]}</span>
              </Link>
              <button style={s.btnOutline} onClick={() => { logout(); navigate('/') }}>Logout</button>
            </>
          ) : (
            <>
              <button style={s.btnOutline}  onClick={() => onAuthOpen('login')}>Log In</button>
              <button style={s.btnPrimary}  onClick={() => onAuthOpen('register')}>Sign Up Free</button>
            </>
          )}
        </div>

        {/* Hamburger */}
        <button style={s.hamburger} onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? '✕' : '☰'}
        </button>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={s.mobileMenu}>
          {links.map(l => (
            <Link key={l.to} to={l.to} style={s.mobileLink} onClick={() => setMenuOpen(false)}>{l.label}</Link>
          ))}
          {isAuth
            ? <button style={s.btnPrimary} onClick={() => { logout(); navigate('/'); setMenuOpen(false) }}>Logout</button>
            : <button style={s.btnPrimary} onClick={() => { onAuthOpen('login'); setMenuOpen(false) }}>Log In / Sign Up</button>
          }
        </div>
      )}
    </>
  )
}

const s = {
  nav: {
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
    height: 'var(--nav-h)',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0 48px',
    background: 'rgba(10,10,10,0.9)',
    backdropFilter: 'blur(20px)',
    borderBottom: '1px solid var(--border)',
  },
  logo: {
    fontFamily: "'Bebas Neue', cursive", fontSize: 26, letterSpacing: 3,
    color: 'var(--white)', display: 'flex', alignItems: 'center', gap: 10,
  },
  dot: {
    display: 'inline-block', width: 8, height: 8,
    background: 'var(--saffron)', borderRadius: '50%',
    animation: 'pulse-dot 2s infinite',
  },
  links: { display: 'flex', gap: 32, listStyle: 'none' },
  link:  { fontSize: 13, fontWeight: 500, transition: 'color .2s' },
  right: { display: 'flex', alignItems: 'center', gap: 12 },
  avatarRow: {
    display: 'flex', alignItems: 'center', gap: 8,
    background: 'var(--dark3)', border: '1px solid var(--border)',
    borderRadius: 8, padding: '5px 14px 5px 6px',
  },
  avatar: {
    width: 28, height: 28, background: 'var(--saffron)', borderRadius: '50%',
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 13, fontWeight: 700, color: 'white',
  },
  btnOutline: {
    padding: '8px 18px', border: '1px solid var(--border)',
    background: 'transparent', color: 'var(--text-muted)', fontSize: 13, borderRadius: 6,
  },
  btnPrimary: {
    padding: '9px 20px', background: 'var(--saffron)', color: 'white',
    fontSize: 13, fontWeight: 600, border: 'none', borderRadius: 6,
  },
  hamburger: {
    display: 'none', background: 'none', border: 'none',
    color: 'var(--text)', fontSize: 22,
    '@media(max-width:768px)': { display: 'block' },
  },
  mobileMenu: {
    position: 'fixed', top: 'var(--nav-h)', left: 0, right: 0, zIndex: 99,
    background: 'var(--dark2)', borderBottom: '1px solid var(--border)',
    padding: '20px', display: 'flex', flexDirection: 'column', gap: 14,
  },
  mobileLink: { fontSize: 16, color: 'var(--text-muted)', padding: '6px 0' },
}
