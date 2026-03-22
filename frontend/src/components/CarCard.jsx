import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function CarSVG({ type, color = '#E0E0E0' }) {
  const big = ['suv','luxury','mpv'].includes(type)
  if (big) return (
    <svg viewBox="0 0 320 140" fill="none" style={{ width: '88%', filter: 'drop-shadow(0 8px 20px rgba(0,0,0,.5))' }}>
      <ellipse cx="160" cy="128" rx="128" ry="9" fill="rgba(0,0,0,.5)"/>
      <circle cx="78"  cy="112" r="19" fill="#111" stroke="#333" strokeWidth="2"/>
      <circle cx="78"  cy="112" r="11" fill="#1a1a1a" stroke="#444"/>
      <circle cx="78"  cy="112" r="5"  fill="#FF6B00" opacity=".8"/>
      <circle cx="242" cy="112" r="19" fill="#111" stroke="#333" strokeWidth="2"/>
      <circle cx="242" cy="112" r="11" fill="#1a1a1a" stroke="#444"/>
      <circle cx="242" cy="112" r="5"  fill="#FF6B00" opacity=".8"/>
      <path d="M38 105 L38 78 Q40 52 68 42 L120 22 Q155 12 190 12 Q225 12 252 30 L280 65 Q290 78 292 95 L294 105 Z" fill={color} stroke="rgba(255,255,255,.08)" strokeWidth="1"/>
      <path d="M130 42 Q155 22 190 20 L192 42 Z" fill="#0D2235" opacity=".9"/>
      <path d="M200 42 L200 20 Q230 24 252 46 L252 42 Z" fill="#0D2235" opacity=".9"/>
      <rect x="38"  y="84" width="12" height="18" rx="3" fill="#FF6B00" opacity=".85"/>
      <rect x="272" y="82" width="16" height="18" rx="4" fill="#EF4444" opacity=".85"/>
    </svg>
  )
  return (
    <svg viewBox="0 0 320 140" fill="none" style={{ width: '88%', filter: 'drop-shadow(0 8px 20px rgba(0,0,0,.5))' }}>
      <ellipse cx="160" cy="128" rx="120" ry="8" fill="rgba(0,0,0,.5)"/>
      <circle cx="82"  cy="112" r="18" fill="#111" stroke="#333" strokeWidth="2"/>
      <circle cx="82"  cy="112" r="11" fill="#1a1a1a" stroke="#444"/>
      <circle cx="82"  cy="112" r="5"  fill="#FF6B00" opacity=".8"/>
      <circle cx="238" cy="112" r="18" fill="#111" stroke="#333" strokeWidth="2"/>
      <circle cx="238" cy="112" r="11" fill="#1a1a1a" stroke="#444"/>
      <circle cx="238" cy="112" r="5"  fill="#FF6B00" opacity=".8"/>
      <path d="M44 105 L44 82 Q46 62 72 52 L118 32 Q150 20 185 20 Q215 20 242 38 L272 72 Q280 84 282 100 L284 105 Z" fill={color} stroke="rgba(255,255,255,.08)" strokeWidth="1"/>
      <path d="M128 52 Q152 32 184 28 L184 52 Z" fill="#0D2235" opacity=".9"/>
      <path d="M192 52 L192 28 Q220 32 242 56 L242 52 Z" fill="#0D2235" opacity=".9"/>
      <rect x="42"  y="86" width="10" height="14" rx="2" fill="#FF6B00" opacity=".85"/>
      <rect x="268" y="84" width="14" height="16" rx="3" fill="#EF4444" opacity=".85"/>
    </svg>
  )
}

const BADGES = {
  luxury:    { label: '👑 Luxury',   bg: 'rgba(245,197,24,.12)', color: '#F5C518', border: 'rgba(245,197,24,.3)' },
  ev:        { label: '⚡ Electric', bg: 'rgba(34,197,94,.12)',  color: '#22C55E', border: 'rgba(34,197,94,.3)'  },
  suv:       { label: '🔥 Popular',  bg: 'rgba(255,107,0,.12)',  color: '#FF6B00', border: 'rgba(255,107,0,.3)'  },
  hatchback: { label: '💰 Budget',   bg: 'rgba(96,165,250,.12)', color: '#60A5FA', border: 'rgba(96,165,250,.3)' },
}

export default function CarCard({ car, onBook }) {
  const [fav, setFav] = useState(false)
  const [hov, setHov] = useState(false)
  const navigate = useNavigate()
  const badge = BADGES[car.type]

  return (
    <div
      style={{ ...s.card, ...(hov ? s.cardHov : {}) }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <div style={s.imgBox}>
        <div style={s.imgBg} />
        {badge && (
          <span style={{ ...s.badge, background: badge.bg, color: badge.color, border: `1px solid ${badge.border}` }}>
            {badge.label}
          </span>
        )}
        <button style={s.fav} onClick={e => { e.stopPropagation(); setFav(!fav) }}>
          {fav ? '❤️' : '🤍'}
        </button>
        <CarSVG type={car.type} color={car.color || '#E0E0E0'} />
      </div>

      <div style={s.body}>
        <div style={s.make}>{car.make}</div>
        <div style={s.name}>{car.model}</div>

        <div style={s.specs}>
          <span style={s.spec}>👥 {car.seats} Seats</span>
          <span style={s.spec}>⛽ {car.fuel}</span>
          <span style={s.spec}>⚙️ {car.transmission}</span>
          <span style={s.spec}>📍 {car.city}</span>
        </div>

        <div style={s.rating}>
          <span style={{ color: '#F5C518' }}>★</span>
          <span style={{ color: 'var(--white)', fontWeight: 600, marginLeft: 3 }}>{car.rating}</span>
          <span style={{ marginLeft: 4 }}>({car.totalTrips} trips)</span>
        </div>

        <div style={s.footer}>
          <div>
            <div style={s.price}>
              <span style={{ fontSize: 12 }}>₹</span>{car.pricePerDay.toLocaleString()}
              <span style={{ fontSize: 12, color: 'var(--text-dim)', fontWeight: 400 }}>/day</span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-dim)' }}>Excl. fuel</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={s.btnDetails} onClick={() => navigate(`/cars/${car._id}`)}>Details</button>
            <button style={s.btnBook}    onClick={() => onBook(car)}>Book →</button>
          </div>
        </div>
      </div>
    </div>
  )
}

const s = {
  card: {
    background: 'var(--card)', border: '1px solid var(--border)',
    borderRadius: 16, overflow: 'hidden', transition: 'all .3s',
    display: 'flex', flexDirection: 'column',
  },
  cardHov: {
    borderColor: 'var(--border-accent)',
    transform: 'translateY(-4px)',
    boxShadow: '0 20px 60px rgba(0,0,0,.5), 0 0 0 1px rgba(255,107,0,.08)',
  },
  imgBox: {
    height: 180, background: 'var(--dark3)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    position: 'relative', overflow: 'hidden',
  },
  imgBg: {
    position: 'absolute', inset: 0,
    background: 'radial-gradient(ellipse at center bottom, rgba(255,107,0,.07) 0%, transparent 70%)',
  },
  badge: {
    position: 'absolute', top: 12, left: 12,
    padding: '4px 10px', borderRadius: 6,
    fontSize: 10, fontWeight: 700, letterSpacing: .5,
  },
  fav: {
    position: 'absolute', top: 10, right: 12,
    width: 30, height: 30, borderRadius: '50%',
    background: 'rgba(10,10,10,.7)', backdropFilter: 'blur(8px)',
    border: '1px solid var(--border)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13,
  },
  body: { padding: 18, flex: 1, display: 'flex', flexDirection: 'column' },
  make: { fontSize: 10, color: 'var(--text-dim)', letterSpacing: .5, textTransform: 'uppercase' },
  name: { fontFamily: "'Syne',sans-serif", fontSize: 20, fontWeight: 700, color: 'var(--white)', margin: '4px 0 10px' },
  specs: { display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 },
  spec:  { fontSize: 11, color: 'var(--text-muted)', background: 'var(--dark4)', padding: '3px 8px', borderRadius: 4 },
  rating: { fontSize: 12, color: 'var(--text-muted)', marginBottom: 14, display: 'flex', alignItems: 'center' },
  footer: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: 14, borderTop: '1px solid var(--border)', marginTop: 'auto',
  },
  price: { fontFamily: "'Syne',sans-serif", fontSize: 22, fontWeight: 800, color: 'var(--white)' },
  btnDetails: {
    padding: '8px 14px', background: 'transparent',
    border: '1px solid var(--border)', color: 'var(--text-muted)',
    borderRadius: 8, fontSize: 12,
  },
  btnBook: {
    padding: '8px 18px', background: 'var(--saffron)',
    color: 'white', border: 'none', borderRadius: 8,
    fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 13,
  },
}
