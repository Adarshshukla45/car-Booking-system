import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BookingModal from '../components/BookingModal'

const FEATURES = [
  { icon: '🛡️', title: '100% Insured',        desc: 'Comprehensive insurance on every rental. Drive worry-free anywhere in India.' },
  { icon: '💳', title: 'No Hidden Charges',    desc: 'Transparent pricing. Pay via UPI, Card, Net Banking or EMI.' },
  { icon: '🚑', title: '24/7 Roadside Help',   desc: 'Breakdown or flat tyre? Our team is available round the clock.' },
  { icon: '🧼', title: 'Sanitized Fleet',      desc: 'Every car deep-cleaned before delivery. Hygiene report on app.' },
  { icon: '📍', title: 'Doorstep Delivery',    desc: 'We bring the car to your home or hotel in select cities.' },
  { icon: '⚡', title: 'Instant Confirmation', desc: 'Booking confirmed in seconds. E-contract and OTP via WhatsApp.' },
]

const CITIES = [
  { icon: '🏛️', name: 'Delhi',     cars: 142 },
  { icon: '🌊', name: 'Mumbai',    cars: 118 },
  { icon: '🌸', name: 'Bangalore', cars: 96  },
  { icon: '☕', name: 'Hyderabad', cars: 84  },
  { icon: '🎭', name: 'Chennai',   cars: 71  },
  { icon: '🏰', name: 'Jaipur',    cars: 58  },
  { icon: '⛵', name: 'Goa',       cars: 64  },
  { icon: '🍃', name: 'Pune',      cars: 76  },
  { icon: '🏔️', name: 'Manali',    cars: 28  },
  { icon: '🌺', name: 'Kochi',     cars: 45  },
  { icon: '🕌', name: 'Agra',      cars: 32  },
  { icon: '➕', name: '+38 more',  cars: null },
]

const STEPS = [
  { icon: '🔍', title: 'Search & Choose', desc: 'Enter city and dates. Browse 100+ verified cars near you.' },
  { icon: '📋', title: 'Book Online',     desc: 'Pick car, add GPS/child seat. Pay via UPI, card or EMI.' },
  { icon: '🚗', title: 'Pick Up & Drive', desc: 'Doorstep delivery or hub pickup. Verify OTP and go!' },
  { icon: '🔄', title: 'Return & Review', desc: 'Drop back at hub. Deposit refunded in 24 hrs.' },
]

const TESTIMONIALS = [
  { stars: 5, text: 'Booked a Hyundai Creta for our Goa trip. Spotless car delivered to hotel. Refund same day!', name: 'Rahul Sharma', city: 'Delhi NCR', avatar: '🧔' },
  { stars: 5, text: 'Best app for self-drive in Mumbai. The Nexon EV was fully charged and GPS ready. Saved so much vs Ola for the weekend.', name: 'Priya Menon', city: 'Mumbai', avatar: '👩' },
  { stars: 4, text: 'Rented a Swift for Manali road trip. Support team super responsive. Amazing experience overall!', name: 'Arjun Kapoor', city: 'Chandigarh', avatar: '🧑' },
]

export default function Home({ onAuthOpen }) {
  const navigate = useNavigate()
  const [bookCar, setBookCar] = useState(null)
  const [city,    setCity]    = useState('')

  const today = new Date()
  const fmt   = d => d.toISOString().split('T')[0]

  return (
    <div>
      {/* ── HERO ── */}
      <section style={s.hero}>
        <div style={s.heroBg} />
        <div style={s.heroGrid} />

        <div style={{ ...s.heroContent, animation: 'fadeUp .7s ease both' }}>
          <div style={s.badge}><span style={s.badgeDot} />India's #1 Self-Drive Platform</div>

          <h1 style={s.heroTitle}>
            DRIVE<br />
            <span style={{ color: 'var(--saffron)' }}>YOUR</span><br />
            <span style={{ WebkitTextStroke: '1.5px rgba(255,255,255,.2)', color: 'transparent' }}>INDIA</span>
          </h1>

          <p style={s.heroSub}>
            Rent premium cars across <strong style={{ color: 'var(--text)' }}>50+ cities</strong> in India.
            Affordable daily rates, zero hidden charges, 24/7 roadside assistance.
            <em style={{ color: 'var(--saffron)', fontStyle: 'normal' }}> Aapka safar, aapki marzi.</em>
          </p>

          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 52 }}>
            <button style={s.btnHero}  onClick={() => navigate('/cars')}>🚗 Browse Cars</button>
            <button style={s.btnGhost} onClick={() => navigate('/cars')}>View All Cities →</button>
          </div>

          <div style={{ display: 'flex', gap: 36 }}>
            {[{ n: '50+', l: 'Cities' }, { n: '1200+', l: 'Cars Fleet' }, { n: '4.8★', l: 'Avg Rating' }, { n: '2L+', l: 'Happy Trips' }].map(st => (
              <div key={st.l}>
                <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: 34, color: 'var(--white)', lineHeight: 1 }}>
                  {st.n.replace('★', '')}<span style={{ color: 'var(--saffron)' }}>{st.n.includes('★') ? '★' : ''}</span>
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 4 }}>{st.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Hero Car */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1, animation: 'fadeUp .7s .2s ease both' }}>
          <div style={{ position: 'relative', width: 580, height: 340 }}>
            <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: 460, height: 100, background: 'radial-gradient(ellipse,rgba(255,107,0,.2) 0%,transparent 70%)', filter: 'blur(20px)' }} />
            <svg style={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)', width: 540, filter: 'drop-shadow(0 20px 60px rgba(255,107,0,.18))', animation: 'float 4s ease-in-out infinite' }} viewBox="0 0 640 280" fill="none">
              <ellipse cx="320" cy="260" rx="260" ry="18" fill="rgba(0,0,0,.6)" />
              <circle cx="155" cy="225" r="38" fill="#111" stroke="#333" strokeWidth="3" /><circle cx="155" cy="225" r="26" fill="#1a1a1a" stroke="#444" strokeWidth="2" /><circle cx="155" cy="225" r="10" fill="#FF6B00" opacity=".8" />
              <circle cx="485" cy="225" r="38" fill="#111" stroke="#333" strokeWidth="3" /><circle cx="485" cy="225" r="26" fill="#1a1a1a" stroke="#444" strokeWidth="2" /><circle cx="485" cy="225" r="10" fill="#FF6B00" opacity=".8" />
              <path d="M80 210 L80 185 Q82 155 120 140 L200 100 Q240 70 320 65 Q400 60 450 80 L540 140 Q575 155 575 185 L578 210 Z" fill="#1C1C1C" stroke="#333" strokeWidth="1.5" />
              <path d="M200 142 Q245 90 320 82 Q400 75 440 115 L540 142 Z" fill="#222" stroke="#3a3a3a" strokeWidth="1" />
              <path d="M225 138 Q250 98 310 90 L310 138 Z" fill="#0D2235" opacity=".9" />
              <path d="M318 138 L318 88 Q380 88 420 115 L420 138 Z" fill="#0D2235" opacity=".9" />
              <path d="M82 178 Q78 168 88 163 L115 158 Q110 172 102 182 Z" fill="#FF6B00" opacity=".9" />
              <rect x="555" y="162" width="22" height="30" rx="4" fill="#EF4444" opacity=".85" />
              <path d="M105 175 Q200 168 450 170 Q510 170 560 175" stroke="rgba(255,107,0,.2)" strokeWidth="2" fill="none" />
            </svg>
            {/* Floating chips */}
            <div style={{ position: 'absolute', top: 30, left: 0, ...chip }}>
              <div style={{ fontSize: 10, color: 'var(--text-dim)', marginBottom: 4, letterSpacing: .5 }}>STARTING FROM</div>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 20, fontWeight: 800, color: 'var(--white)' }}>₹799 <span style={{ fontSize: 12, color: 'var(--text-dim)', fontWeight: 400 }}>/day</span></div>
            </div>
            <div style={{ position: 'absolute', bottom: 90, right: 0, ...chip }}>
              <div style={{ fontSize: 10, color: 'var(--text-dim)', marginBottom: 4, letterSpacing: .5 }}>AVAILABLE NOW</div>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 18, fontWeight: 700, color: 'var(--white)' }}>50+ Cities 🇮🇳</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SEARCH BAR ── */}
      <div style={{ padding: '0 48px 80px' }}>
        <div style={s.searchCard}>
          <SField label="📍 Pickup City"  input={<input style={s.sInput} placeholder="Delhi, Mumbai, Goa..." value={city} onChange={e => setCity(e.target.value)} />} />
          <div style={s.div} />
          <SField label="📅 Pickup Date"  input={<input style={s.sInput} type="date" defaultValue={fmt(new Date(today.getTime() + 86400000))} />} />
          <div style={s.div} />
          <SField label="📅 Return Date"  input={<input style={s.sInput} type="date" defaultValue={fmt(new Date(today.getTime() + 4 * 86400000))} />} />
          <div style={s.div} />
          <SField label="🚗 Car Type" input={
            <select style={s.sInput}>
              {['All Types', 'Hatchback', 'Sedan', 'SUV', 'Luxury', 'Electric'].map(t => <option key={t}>{t}</option>)}
            </select>
          } />
          <button style={s.searchBtn} onClick={() => navigate(`/cars${city ? `?city=${city}` : ''}`)}>🔍 Search Cars</button>
        </div>
      </div>

      {/* ── HOW IT WORKS ── */}
      <section style={{ ...s.section, background: 'var(--dark2)' }} id="how">
        <SHead tag="Process" title="HOW IT WORKS" sub="Book a car in under 3 minutes. We handle the rest." />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
          {STEPS.map((st, i) => (
            <div key={i} style={{ padding: '32px 26px', position: 'relative', borderRight: i < STEPS.length - 1 ? '1px solid var(--border)' : 'none', background: 'var(--card)' }}>
              <div style={{ position: 'absolute', top: 14, right: 16, fontFamily: "'Bebas Neue',cursive", fontSize: 52, color: 'var(--saffron)', opacity: .12 }}>0{i + 1}</div>
              <div style={{ fontSize: 28, marginBottom: 14 }}>{st.icon}</div>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 15, fontWeight: 700, color: 'var(--white)', marginBottom: 8 }}>{st.title}</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>{st.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={s.section}>
        <SHead tag="Why DriveIndia" title="EVERY ADVANTAGE" sub="" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(230px,1fr))', gap: 18 }}>
          {FEATURES.map(f => (
            <div key={f.title} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: 26 }}>
              <div style={{ width: 46, height: 46, background: 'rgba(255,107,0,.1)', border: '1px solid var(--border-accent)', borderRadius: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, marginBottom: 16 }}>{f.icon}</div>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 16, fontWeight: 700, color: 'var(--white)', marginBottom: 8 }}>{f.title}</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.7 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CITIES ── */}
      <section style={{ ...s.section, background: 'var(--dark2)' }} id="cities">
        <SHead tag="Coverage" title={<>PICK UP ACROSS <span style={{ color: 'var(--saffron)' }}>INDIA</span></>} sub="Available in 50+ cities and growing every month." />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(148px,1fr))', gap: 12 }}>
          {CITIES.map(c => (
            <div key={c.name} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: 18, textAlign: 'center', cursor: 'pointer', transition: 'all .2s' }} onClick={() => navigate(`/cars?city=${c.name}`)}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{c.icon}</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--white)' }}>{c.name}</div>
              {c.cars && <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 4 }}>{c.cars} cars</div>}
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={s.section}>
        <SHead tag="Reviews" title={<>WHAT INDIANS <span style={{ color: 'var(--saffron)' }}>SAY</span></>} sub="" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 18 }}>
          {TESTIMONIALS.map(t => (
            <div key={t.name} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: 26 }}>
              <div style={{ color: '#F5C518', marginBottom: 12, letterSpacing: 2 }}>{'★'.repeat(t.stars)}</div>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 18, fontStyle: 'italic' }}>"{t.text}"</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(255,107,0,.1)', border: '2px solid var(--border-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>{t.avatar}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--white)' }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-dim)' }}>{t.city}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <div style={s.ctaBanner} id="offers">
        <div style={s.ctaGlow} />
        <div>
          <h2 style={{ fontFamily: "'Bebas Neue',cursive", fontSize: 50, letterSpacing: 1, color: 'var(--white)', lineHeight: 1, marginBottom: 10 }}>
            FIRST RIDE<br /><span style={{ color: 'var(--saffron)' }}>₹500 OFF</span>
          </h2>
          <p style={{ fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.65 }}>
            Use code <strong style={{ color: 'var(--saffron)' }}>DRIVEIN500</strong> on your first booking.<br />Valid on all cars above ₹999/day.
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start' }}>
          <button style={s.btnHero} onClick={() => navigate('/cars')}>🚗 Book Now & Save</button>
          <div style={{ display: 'flex', gap: 10 }}>
            {[{ icon: '🍎', sub: 'Download on', main: 'App Store' }, { icon: '▶️', sub: 'Get it on', main: 'Google Play' }].map(a => (
              <a key={a.main} href="#" style={{ padding: '10px 16px', background: 'var(--dark3)', border: '1px solid var(--border)', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text)' }}>
                <span style={{ fontSize: 22 }}>{a.icon}</span>
                <span><span style={{ display: 'block', fontSize: 10, color: 'var(--text-dim)' }}>{a.sub}</span><span style={{ fontSize: 13, fontWeight: 600 }}>{a.main}</span></span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {bookCar && <BookingModal car={bookCar} onClose={() => setBookCar(null)} />}
    </div>
  )
}

function SHead({ tag, title, sub }) {
  return (
    <div style={{ marginBottom: 44 }}>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--saffron)', marginBottom: 10 }}>{tag}</div>
      <h2 style={{ fontFamily: "'Bebas Neue',cursive", fontSize: 'clamp(40px,5vw,62px)', letterSpacing: 1, color: 'var(--white)', lineHeight: 1 }}>{title}</h2>
      {sub && <p style={{ fontSize: 15, color: 'var(--text-muted)', marginTop: 12, maxWidth: 480, lineHeight: 1.7 }}>{sub}</p>}
    </div>
  )
}

function SField({ label, input }) {
  return (
    <div style={{ flex: 1, minWidth: 140 }}>
      <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: 8 }}>{label}</div>
      {input}
    </div>
  )
}

const chip = { background: 'rgba(20,20,20,.85)', border: '1px solid var(--border)', borderRadius: 12, padding: '12px 16px', backdropFilter: 'blur(10px)', animation: 'fadeUp .7s .4s ease both' }

const s = {
  hero: { minHeight: '100vh', display: 'flex', alignItems: 'center', padding: 'calc(var(--nav-h) + 40px) 48px 60px', position: 'relative', overflow: 'hidden', gap: 20 },
  heroBg: { position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 65% 50%, rgba(255,107,0,.06) 0%,transparent 70%)' },
  heroGrid: { position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,.018) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.018) 1px,transparent 1px)', backgroundSize: '60px 60px', maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%,black,transparent)' },
  heroContent: { maxWidth: 540, position: 'relative', zIndex: 1, flex: '0 0 auto' },
  badge: { display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', border: '1px solid var(--border-accent)', background: 'rgba(255,107,0,.1)', borderRadius: 100, fontSize: 11, fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--saffron)', marginBottom: 22 },
  badgeDot: { display: 'inline-block', width: 5, height: 5, background: 'var(--saffron)', borderRadius: '50%' },
  heroTitle: { fontFamily: "'Bebas Neue',cursive", fontSize: 'clamp(70px,9vw,118px)', lineHeight: .92, letterSpacing: 2, color: 'var(--white)', marginBottom: 22 },
  heroSub: { fontSize: 15, lineHeight: 1.75, color: 'var(--text-muted)', marginBottom: 36, fontWeight: 300, maxWidth: 440 },
  btnHero: { padding: '13px 28px', background: 'var(--saffron)', color: 'white', border: 'none', borderRadius: 8, fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 14 },
  btnGhost: { padding: '13px 24px', background: 'transparent', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: 8, fontFamily: "'Syne',sans-serif", fontWeight: 600, fontSize: 14 },
  searchCard: { background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: '24px 28px', display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' },
  sInput: { width: '100%', background: 'var(--dark3)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px', color: 'var(--white)', fontSize: 14, outline: 'none' },
  div: { width: 1, height: 55, background: 'var(--border)', alignSelf: 'flex-end', marginBottom: 2 },
  searchBtn: { padding: '11px 24px', background: 'var(--saffron)', color: 'white', border: 'none', borderRadius: 8, fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 13, whiteSpace: 'nowrap' },
  section: { padding: '80px 48px' },
  ctaBanner: { margin: '0 48px 80px', padding: '52px', background: 'linear-gradient(135deg,#1A0F00,#2A1500,#1A0F00)', border: '1px solid var(--border-accent)', borderRadius: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 32, flexWrap: 'wrap', position: 'relative', overflow: 'hidden' },
  ctaGlow: { position: 'absolute', top: '-40%', right: '-5%', width: 360, height: 360, background: 'radial-gradient(circle,rgba(255,107,0,.1) 0%,transparent 70%)', pointerEvents: 'none' },
}
