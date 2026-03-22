import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer style={s.footer}>
      <div style={s.grid}>
        <div>
          <div style={s.logo}>
            <span style={s.dot} />
            Drive<span style={{ color: 'var(--saffron)' }}>India</span>
          </div>
          <p style={s.desc}>
            India's most trusted self-drive car rental platform. Available in 50+ cities
            with 1200+ premium cars at unbeatable daily rates.
          </p>
          <div style={s.socials}>
            {['𝕏', '📘', '📸', '💼'].map(icon => (
              <a key={icon} href="#" style={s.social}>{icon}</a>
            ))}
          </div>
        </div>

        {[
          { title: 'Company', links: ['About Us', 'Careers', 'Press & Media', 'Partner With Us'] },
          { title: 'Support', links: ['Help Center', 'Contact Us', 'Safety Guide', 'Damage Policy'] },
          { title: 'Legal',   links: ['Terms of Service', 'Privacy Policy', 'Cancellation', 'Cookie Policy'] },
        ].map(col => (
          <div key={col.title}>
            <div style={s.colTitle}>{col.title}</div>
            <ul style={s.links}>
              {col.links.map(l => (
                <li key={l}><a href="#" style={s.link}>{l}</a></li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div style={s.bottom}>
        <span>© 2025 DriveIndia Technologies Pvt. Ltd. — CIN: U74999MH2024PTC000000</span>
        <span>🇮🇳 Made in India | GST: 27AAAAA0000A1Z5</span>
      </div>
    </footer>
  )
}

const s = {
  footer: {
    background: 'var(--dark2)', borderTop: '1px solid var(--border)',
    padding: '56px 48px 28px',
  },
  grid: {
    display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr',
    gap: 48, marginBottom: 40,
  },
  logo: {
    fontFamily: "'Bebas Neue',cursive", fontSize: 24, letterSpacing: 3,
    color: 'var(--white)', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14,
  },
  dot: { display: 'inline-block', width: 7, height: 7, background: 'var(--saffron)', borderRadius: '50%' },
  desc: { fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.7, maxWidth: 280, marginBottom: 20 },
  socials: { display: 'flex', gap: 10 },
  social: {
    width: 32, height: 32, background: 'var(--dark3)', border: '1px solid var(--border)',
    borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
  },
  colTitle: { fontFamily: "'Syne',sans-serif", fontSize: 13, fontWeight: 700, color: 'var(--white)', marginBottom: 18 },
  links: { listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 },
  link:  { fontSize: 13, color: 'var(--text-muted)' },
  bottom: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: 22, borderTop: '1px solid var(--border)',
    fontSize: 11, color: 'var(--text-dim)', flexWrap: 'wrap', gap: 8,
  },
}
