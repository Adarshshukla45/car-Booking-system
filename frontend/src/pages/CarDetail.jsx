import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MOCK_CARS } from '../services/api'
import BookingModal from '../components/BookingModal'

const REVIEWS = [
  { name: 'Neha Gupta',  city: 'Delhi',     rating: 5, text: 'Absolutely spotless car! Picked it up from the hub, fully fuelled. Would book again.', avatar: '👩‍💼', date: 'Feb 2025' },
  { name: 'Vikram Nair', city: 'Bangalore', rating: 5, text: 'Smooth booking. Car in perfect condition. GPS was super helpful for my Coorg trip!', avatar: '🧑‍💻', date: 'Jan 2025' },
  { name: 'Sneha Joshi', city: 'Mumbai',    rating: 4, text: 'Great car, minor delay at pickup but team sorted it quickly. Overall very happy!', avatar: '👩‍🎨', date: 'Mar 2025' },
]

export default function CarDetail({ onAuthOpen }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [car,      setCar]      = useState(null)
  const [similar,  setSimilar]  = useState([])
  const [showBook, setShowBook] = useState(false)
  const [tab,      setTab]      = useState('overview')

  useEffect(() => {
    const found = MOCK_CARS.find(c => c._id === id)
    if (!found) { navigate('/cars'); return }
    setCar(found)
    setSimilar(MOCK_CARS.filter(c => c._id !== id && c.type === found.type).slice(0, 3))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [id])

  if (!car) return <div style={{ paddingTop: 'calc(var(--nav-h) + 60px)', textAlign: 'center', color: 'var(--text-muted)', fontSize: 18 }}>Loading...</div>

  return (
    <div style={{ paddingTop: 'var(--nav-h)', minHeight: '100vh', paddingBottom: 80 }}>

      {/* Breadcrumb */}
      <div style={{ padding: '20px 48px 0', display: 'flex', gap: 6, fontSize: 13, color: 'var(--text-muted)' }}>
        <span style={{ color: 'var(--saffron)', cursor: 'pointer' }} onClick={() => navigate('/')}>Home</span>
        <span>/</span>
        <span style={{ color: 'var(--saffron)', cursor: 'pointer' }} onClick={() => navigate('/cars')}>Cars</span>
        <span>/</span>
        <span>{car.make} {car.model}</span>
      </div>

      {/* Hero Row */}
      <div style={s.heroRow}>
        {/* Car Visual */}
        <div style={s.carBox}>
          <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: 400, height: 100, background: 'radial-gradient(ellipse,rgba(255,107,0,.12) 0%,transparent 70%)', filter: 'blur(20px)' }} />
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,.015) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.015) 1px,transparent 1px)', backgroundSize: '40px 40px' }} />
          <BigCarSVG type={car.type} color={car.color || '#E0E0E0'} />
          {/* Float tags */}
          {[
            { pos: { top: 20, left: 20 },   label: 'FUEL',         val: car.fuel },
            { pos: { top: 20, right: 20 },  label: 'GEARBOX',      val: car.transmission },
            { pos: { bottom: 20, left: 20 }, label: 'SEATS',       val: `${car.seats} People` },
            { pos: { bottom: 20, right: 20 },label: 'CITY',        val: car.city },
          ].map(tag => (
            <div key={tag.label} style={{ position: 'absolute', background: 'rgba(15,15,15,.85)', backdropFilter: 'blur(12px)', border: '1px solid var(--border)', borderRadius: 10, padding: '8px 14px', zIndex: 2, ...tag.pos }}>
              <div style={{ fontSize: 10, color: 'var(--text-dim)', letterSpacing: 1, marginBottom: 2 }}>{tag.label}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--white)' }}>{tag.val}</div>
            </div>
          ))}
        </div>

        {/* Info */}
        <div style={s.info}>
          <div style={{ fontSize: 11, color: 'var(--text-dim)', letterSpacing: 2, fontWeight: 600, marginBottom: 6 }}>{car.type.toUpperCase()} · {car.make.toUpperCase()}</div>
          <h1 style={{ fontFamily: "'Bebas Neue',cursive", fontSize: 64, letterSpacing: 2, color: 'var(--white)', lineHeight: .92, marginBottom: 16 }}>{car.model}</h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22, flexWrap: 'wrap' }}>
            <span style={{ color: '#F5C518', letterSpacing: 2 }}>{'★'.repeat(Math.floor(car.rating))}</span>
            <span style={{ fontWeight: 700, color: 'var(--white)' }}>{car.rating}</span>
            <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>({car.totalTrips} trips)</span>
            <span style={{ padding: '3px 12px', background: 'rgba(34,197,94,.1)', border: '1px solid rgba(34,197,94,.25)', borderRadius: 20, fontSize: 11, color: 'var(--green)', fontWeight: 600 }}>✅ Available</span>
          </div>

          {/* Price */}
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: '20px 22px', display: 'flex', gap: 24, alignItems: 'center', marginBottom: 22 }}>
            <div>
              <div style={{ fontSize: 10, color: 'var(--text-dim)', letterSpacing: .8, textTransform: 'uppercase', marginBottom: 4 }}>Daily Rate</div>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 32, fontWeight: 800, color: 'var(--white)', lineHeight: 1 }}>₹{car.pricePerDay.toLocaleString()}<span style={{ fontSize: 14, fontWeight: 400, color: 'var(--text-dim)' }}>/day</span></div>
              <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 4 }}>Excl. fuel · Incl. insurance</div>
            </div>
            <div style={{ width: 1, height: 50, background: 'var(--border)' }} />
            <div>
              <div style={{ fontSize: 10, color: 'var(--text-dim)', letterSpacing: .8, textTransform: 'uppercase', marginBottom: 4 }}>Weekend (2 days)</div>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 24, fontWeight: 800, color: 'var(--white)' }}>₹{(car.pricePerDay * 2).toLocaleString()}</div>
              <div style={{ fontSize: 11, color: 'var(--green)', marginTop: 4 }}>Save 10% →</div>
            </div>
          </div>

          {/* Specs grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 18 }}>
            {[{ icon: '⛽', l: 'Fuel', v: car.fuel }, { icon: '⚙️', l: 'Gearbox', v: car.transmission }, { icon: '👥', l: 'Seats', v: `${car.seats} People` }, { icon: '📍', l: 'City', v: car.city }, { icon: '🏷️', l: 'Type', v: car.type }, { icon: '⭐', l: 'Rating', v: `${car.rating}/5` }].map(sp => (
              <div key={sp.l} style={{ background: 'var(--dark3)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 14px', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 16 }}>{sp.icon}</span>
                <div>
                  <div style={{ fontSize: 10, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: .5 }}>{sp.l}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--white)', marginTop: 2 }}>{sp.v}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
            {['🛡️ Insured', '📍 GPS Ready', '🧼 Sanitized', '📱 App Unlock', '⛽ Any Pump'].map(f => (
              <span key={f} style={{ padding: '5px 12px', background: 'var(--dark3)', border: '1px solid var(--border)', borderRadius: 20, fontSize: 11, color: 'var(--text-muted)' }}>{f}</span>
            ))}
          </div>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
            <button style={s.btnBook} onClick={() => setShowBook(true)}>🚗 Book This Car</button>
            <button style={s.btnCheckout} onClick={() => navigate(`/checkout/${car._id}`)}>⚡ Quick Checkout</button>
          </div>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: 11, color: 'var(--text-dim)' }}>
            <span>✅ Free cancellation 24h before</span>
            <span>🔒 Secure payment</span>
            <span>📞 24/7 support</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, padding: '0 48px', borderBottom: '1px solid var(--border)' }}>
        {['overview','features','reviews','faqs'].map(t => (
          <button key={t} style={{ padding: '12px 22px', background: 'none', border: 'none', color: tab === t ? 'var(--saffron)' : 'var(--text-muted)', fontSize: 14, fontWeight: tab === t ? 600 : 500, borderBottom: `2px solid ${tab === t ? 'var(--saffron)' : 'transparent'}`, marginBottom: -1 }} onClick={() => setTab(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      <div style={{ padding: '36px 48px 0', animation: 'fadeUp .4s ease' }}>
        {tab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
            <div>
              <h3 style={s.tabH}>About This Car</h3>
              <p style={s.para}>The <strong style={{ color: 'var(--white)' }}>{car.make} {car.model}</strong> is one of India's most loved {car.type}s, perfect for city drives and highway trips alike. {car.fuel === 'Electric' ? 'Eco-friendly and cost-effective.' : `Runs on ${car.fuel} — refuel at any pump.`}</p>
              <h3 style={{ ...s.tabH, marginTop: 28 }}>What's Included</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
                {['🛡️ Insurance','🔧 Roadside Help','🧼 Sanitization','📋 Documents','📱 App Unlock','🗺️ Route Help'].map(item => (
                  <div key={item} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px 10px', textAlign: 'center', fontSize: 13, color: 'var(--text-muted)' }}>{item}</div>
                ))}
              </div>
            </div>
            <div>
              <h3 style={s.tabH}>Pickup Hubs in {car.city}</h3>
              {[`${car.city} Central Hub`, `${car.city} Airport Hub`, 'Doorstep Delivery (+₹299)'].map((hub, i) => (
                <div key={hub} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: i === 2 ? 'rgba(255,107,0,.06)' : 'var(--card)', border: `1px solid ${i === 2 ? 'var(--border-accent)' : 'var(--border)'}`, borderRadius: 10, marginBottom: 8 }}>
                  <span style={{ fontSize: 18 }}>{i === 2 ? '🏠' : '🏢'}</span>
                  <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: 'var(--white)' }}>{hub}</span>
                  <span style={{ fontSize: 12, color: 'var(--saffron)', fontWeight: 600 }}>Select →</span>
                </div>
              ))}
              <h3 style={{ ...s.tabH, marginTop: 24 }}>Cancellation Policy</h3>
              <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
                {[{ time: 'Before 24 hours', refund: '100% Refund', color: 'var(--green)' }, { time: '12–24 hours', refund: '50% Refund', color: '#F5C518' }, { time: 'Less than 12 hrs', refund: 'No Refund', color: 'var(--red)' }].map(p => (
                  <div key={p.time} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid var(--border)', fontSize: 13 }}>
                    <span style={{ color: 'var(--text-muted)' }}>{p.time}</span>
                    <span style={{ fontWeight: 600, color: p.color }}>{p.refund}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'features' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 16 }}>
            {[
              { cat: 'Safety',  items: ['ABS Brakes','Airbags (2)','ISOFIX Mounts','Rear Sensor','Speed Alert'] },
              { cat: 'Comfort', items: ['Air Conditioning','Power Windows','Adjustable Headrests','Armrest','Rear AC'] },
              { cat: 'Tech',    items: ['Touchscreen Infotainment','Bluetooth','USB Ports','GPS Navigation','Reverse Camera'] },
              { cat: 'Extras',  items: ['Central Locking','Keyless Entry','Cruise Control','Auto Headlamps','Steering Controls'] },
            ].map(cat => (
              <div key={cat.cat} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 13, fontWeight: 700, color: 'var(--saffron)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>{cat.cat}</div>
                {cat.items.map(item => (
                  <div key={item} style={{ display: 'flex', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid var(--border)', fontSize: 13, color: 'var(--text-muted)' }}>
                    <span style={{ color: 'var(--green)', marginRight: 8 }}>✓</span>{item}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {tab === 'reviews' && (
          <div>
            <div style={{ display: 'flex', gap: 48, alignItems: 'center', marginBottom: 32, background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: '24px 28px' }}>
              <div>
                <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: 72, color: 'var(--saffron)', lineHeight: 1 }}>{car.rating}</div>
                <div style={{ color: '#F5C518', fontSize: 20, letterSpacing: 2 }}>{'★'.repeat(Math.floor(car.rating))}</div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>{car.totalTrips} reviews</div>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[5,4,3,2,1].map(n => (
                  <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 12, color: 'var(--text-dim)', width: 8 }}>{n}</span>
                    <span style={{ color: '#F5C518', fontSize: 11 }}>★</span>
                    <div style={{ flex: 1, height: 6, background: 'var(--dark4)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ height: '100%', background: 'var(--saffron)', borderRadius: 3, width: `${[80,65,30,10,5][5-n]}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 16 }}>
              {REVIEWS.map(r => (
                <div key={r.name} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(255,107,0,.1)', border: '2px solid var(--border-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>{r.avatar}</div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--white)' }}>{r.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-dim)' }}>{r.city} · {r.date}</div>
                      </div>
                    </div>
                    <div style={{ color: '#F5C518', letterSpacing: 1 }}>{'★'.repeat(r.rating)}</div>
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.7, fontStyle: 'italic' }}>"{r.text}"</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'faqs' && (
          <div style={{ maxWidth: 720, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { q: 'What documents do I need?', a: 'Valid driving license (original), Aadhaar/passport, and a credit/debit card for the security deposit.' },
              { q: 'Minimum age to rent?', a: 'You must be at least 21 years old with a driving license held for at least 1 year.' },
              { q: 'Is fuel included?', a: 'No. You receive the car with a full tank and must return it full. Shortfall is charged separately.' },
              { q: 'Can I drive outside the city?', a: 'Yes! You can drive anywhere in India. Inform us if crossing state borders as some states require additional permits.' },
              { q: 'What if the car breaks down?', a: 'Call our 24/7 roadside assistance. We arrange repair or replacement within 2 hours.' },
              { q: 'How to extend my booking?', a: 'Extend via app or by calling support, subject to availability. Extension charges apply per day.' },
            ].map((faq, i) => <FAQ key={i} q={faq.q} a={faq.a} />)}
          </div>
        )}
      </div>

      {/* Similar cars */}
      {similar.length > 0 && (
        <div style={{ padding: '48px 48px 0' }}>
          <h2 style={{ fontFamily: "'Bebas Neue',cursive", fontSize: 44, letterSpacing: 1, color: 'var(--white)', marginBottom: 24 }}>
            SIMILAR <span style={{ color: 'var(--saffron)' }}>CARS</span>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 16 }}>
            {similar.map(sc => (
              <div key={sc._id} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden', cursor: 'pointer' }} onClick={() => { navigate(`/cars/${sc._id}`); window.scrollTo({ top: 0 }) }}>
                <div style={{ height: 150, background: 'var(--dark3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <SmallCarSVG color={sc.color || '#E0E0E0'} />
                </div>
                <div style={{ padding: '14px 16px' }}>
                  <div style={{ fontSize: 10, color: 'var(--text-dim)', textTransform: 'uppercase' }}>{sc.make}</div>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 17, fontWeight: 700, color: 'var(--white)', margin: '3px 0 8px' }}>{sc.model}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 18, fontWeight: 800, color: 'var(--saffron)' }}>₹{sc.pricePerDay.toLocaleString()}<span style={{ fontSize: 11, fontWeight: 400, color: 'var(--text-dim)' }}>/day</span></span>
                    <span style={{ fontSize: 12, color: '#F5C518' }}>★ {sc.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showBook && <BookingModal car={car} onClose={() => setShowBook(false)} onSuccess={() => setShowBook(false)} />}
    </div>
  )
}

function FAQ({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ background: 'var(--card)', border: `1px solid ${open ? 'var(--border-accent)' : 'var(--border)'}`, borderRadius: 12, overflow: 'hidden' }}>
      <button style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', background: 'none', border: 'none', color: 'var(--white)', fontSize: 14, fontWeight: 600, textAlign: 'left', cursor: 'pointer' }} onClick={() => setOpen(!open)}>
        <span>{q}</span>
        <span style={{ color: 'var(--saffron)', fontSize: 20, transform: open ? 'rotate(45deg)' : 'rotate(0)', transition: 'transform .2s' }}>+</span>
      </button>
      {open && <div style={{ padding: '0 20px 16px', fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.7 }}>{a}</div>}
    </div>
  )
}

function BigCarSVG({ type, color }) {
  const big = ['suv','luxury','mpv'].includes(type)
  if (big) return (
    <svg viewBox="0 0 640 280" fill="none" style={{ width: '85%', filter: 'drop-shadow(0 24px 60px rgba(255,107,0,.18))', animation: 'float 4s ease-in-out infinite', position: 'relative', zIndex: 1 }}>
      <ellipse cx="320" cy="260" rx="260" ry="18" fill="rgba(0,0,0,.6)" />
      <circle cx="155" cy="225" r="38" fill="#111" stroke="#333" strokeWidth="3" /><circle cx="155" cy="225" r="26" fill="#1a1a1a" stroke="#444" strokeWidth="2" /><circle cx="155" cy="225" r="10" fill="#FF6B00" opacity=".8" />
      <circle cx="485" cy="225" r="38" fill="#111" stroke="#333" strokeWidth="3" /><circle cx="485" cy="225" r="26" fill="#1a1a1a" stroke="#444" strokeWidth="2" /><circle cx="485" cy="225" r="10" fill="#FF6B00" opacity=".8" />
      <path d="M80 210 L80 185 Q82 155 120 140 L200 100 Q240 70 320 65 Q400 60 450 80 L540 140 Q575 155 575 185 L578 210 Z" fill={color} stroke="rgba(255,255,255,.1)" strokeWidth="1.5" />
      <path d="M200 142 Q245 90 320 82 Q400 75 440 115 L540 142 Z" fill="rgba(255,255,255,.04)" />
      <path d="M225 138 Q250 98 310 90 L310 138 Z" fill="#0D2235" opacity=".9" />
      <path d="M318 138 L318 88 Q380 88 420 115 L420 138 Z" fill="#0D2235" opacity=".9" />
      <path d="M82 178 Q78 168 88 163 L115 158 Q110 172 102 182 Z" fill="#FF6B00" opacity=".9" />
      <rect x="555" y="162" width="22" height="30" rx="4" fill="#EF4444" opacity=".85" />
    </svg>
  )
  return (
    <svg viewBox="0 0 640 260" fill="none" style={{ width: '85%', filter: 'drop-shadow(0 20px 50px rgba(255,107,0,.15))', animation: 'float 4s ease-in-out infinite', position: 'relative', zIndex: 1 }}>
      <ellipse cx="320" cy="244" rx="240" ry="14" fill="rgba(0,0,0,.6)" />
      <circle cx="155" cy="210" r="36" fill="#111" stroke="#333" strokeWidth="3" /><circle cx="155" cy="210" r="24" fill="#1a1a1a" stroke="#444" strokeWidth="2" /><circle cx="155" cy="210" r="9" fill="#FF6B00" opacity=".8" />
      <circle cx="485" cy="210" r="36" fill="#111" stroke="#333" strokeWidth="3" /><circle cx="485" cy="210" r="24" fill="#1a1a1a" stroke="#444" strokeWidth="2" /><circle cx="485" cy="210" r="9" fill="#FF6B00" opacity=".8" />
      <path d="M86 196 L86 174 Q88 148 118 136 L190 96 Q228 68 316 64 Q396 60 444 80 L536 138 Q568 152 568 174 L570 196 Z" fill={color} stroke="rgba(255,255,255,.1)" strokeWidth="1.5" />
      <path d="M188 138 Q232 88 316 80 Q394 74 436 112 L534 138 Z" fill="rgba(255,255,255,.04)" />
      <path d="M206 136 Q236 96 302 86 L302 136 Z" fill="#0D2235" opacity=".9" />
      <path d="M314 136 L314 84 Q376 86 416 112 L416 136 Z" fill="#0D2235" opacity=".9" />
      <path d="M86 170 Q80 160 92 154 L118 150 Q112 164 104 174 Z" fill="#FF6B00" opacity=".9" />
      <rect x="548" y="152" width="20" height="28" rx="4" fill="#EF4444" opacity=".85" />
    </svg>
  )
}

function SmallCarSVG({ color }) {
  return (
    <svg viewBox="0 0 320 140" fill="none" style={{ width: '80%', filter: 'drop-shadow(0 6px 16px rgba(0,0,0,.5))' }}>
      <ellipse cx="160" cy="128" rx="120" ry="8" fill="rgba(0,0,0,.5)" />
      <circle cx="82" cy="112" r="18" fill="#111" stroke="#333" strokeWidth="2" /><circle cx="82" cy="112" r="11" fill="#1a1a1a" stroke="#444" /><circle cx="82" cy="112" r="5" fill="#FF6B00" opacity=".8" />
      <circle cx="238" cy="112" r="18" fill="#111" stroke="#333" strokeWidth="2" /><circle cx="238" cy="112" r="11" fill="#1a1a1a" stroke="#444" /><circle cx="238" cy="112" r="5" fill="#FF6B00" opacity=".8" />
      <path d="M44 105 L44 82 Q46 62 72 52 L118 32 Q150 20 185 20 Q215 20 242 38 L272 72 Q280 84 282 100 L284 105 Z" fill={color} stroke="rgba(255,255,255,.08)" strokeWidth="1" />
      <path d="M128 52 Q152 32 184 28 L184 52 Z" fill="#0D2235" opacity=".9" />
      <path d="M192 52 L192 28 Q220 32 242 56 L242 52 Z" fill="#0D2235" opacity=".9" />
    </svg>
  )
}

const s = {
  heroRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, padding: '28px 48px 48px', alignItems: 'start' },
  carBox: { background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 20, height: 380, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' },
  info: { display: 'flex', flexDirection: 'column', paddingTop: 8 },
  btnBook: { flex: 1, padding: '14px', background: 'var(--saffron)', color: 'white', border: 'none', borderRadius: 10, fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 15 },
  btnCheckout: { flex: 1, padding: '14px', background: 'var(--dark3)', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: 10, fontFamily: "'Syne',sans-serif", fontWeight: 600, fontSize: 14 },
  tabH: { fontFamily: "'Syne',sans-serif", fontSize: 16, fontWeight: 700, color: 'var(--white)', marginBottom: 14 },
  para: { fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.75, marginBottom: 12 },
}
