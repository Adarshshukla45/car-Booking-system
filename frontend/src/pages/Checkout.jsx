import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MOCK_CARS } from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function Checkout({ onAuthOpen }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuth, user } = useAuth()
  const [car, setCar] = useState(null)
  const [step, setStep] = useState(1)
  const [method, setMethod] = useState('UPI')
  const [coupon, setCoupon] = useState('')
  const [discount, setDiscount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '', email: user?.email || '' })
  const [extras, setExtras] = useState({ gps: false, child: false, sanitize: false })

  const today = new Date()
  const fmt   = d => d.toISOString().split('T')[0]
  const [pickup, setPickup] = useState(fmt(new Date(today.getTime() + 86400000)))
  const [ret,    setRet]    = useState(fmt(new Date(today.getTime() + 4 * 86400000)))
  const [hub,    setHub]    = useState('City Centre Hub')

  useEffect(() => {
    const found = MOCK_CARS.find(c => c._id === id)
    if (!found) { navigate('/cars'); return }
    setCar(found)
    setHub(`${found.city} — Central Hub`)
  }, [id])

  const days  = Math.max(1, Math.ceil((new Date(ret) - new Date(pickup)) / 86400000))
  const extrasTotal = (extras.gps ? 200 : 0) + (extras.child ? 300 : 0) + (extras.sanitize ? 150 : 0)
  const base  = car ? days * car.pricePerDay : 0
  const total = base + extrasTotal - discount

  const confirm = async () => {
    if (!isAuth) { onAuthOpen?.('login'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 1500))
    setLoading(false)
    setStep(4)
  }

  if (!car) return <div style={{ paddingTop: 'calc(var(--nav-h) + 40px)', textAlign: 'center', color: 'var(--text-muted)', fontSize: 18 }}>Loading...</div>

  const otp = 7384

  return (
    <div style={s.page}>
      <div style={s.left}>
        <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>
          <span style={{ color: 'var(--saffron)', cursor: 'pointer' }} onClick={() => navigate('/cars')}>Cars</span>
          <span> / {car.make} {car.model} / Checkout</span>
        </div>

        {step !== 4 && (
          <>
            <h1 style={s.pageTitle}>CHECKOUT</h1>

            {/* Progress */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28, flexWrap: 'wrap' }}>
              {['Trip Details','Add-ons','Payment'].map((lbl, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: step > i + 1 ? 'var(--green)' : step === i + 1 ? 'var(--saffron)' : 'var(--dark4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: 'white', flexShrink: 0 }}>
                    {step > i + 1 ? '✓' : i + 1}
                  </div>
                  <span style={{ fontSize: 13, color: step === i + 1 ? 'var(--white)' : 'var(--text-dim)', fontWeight: step === i + 1 ? 600 : 400 }}>{lbl}</span>
                  {i < 2 && <div style={{ flex: 1, height: 1, background: step > i + 1 ? 'var(--saffron)' : 'var(--border)', minWidth: 24 }} />}
                </div>
              ))}
            </div>
          </>
        )}

        {/* Step 1 */}
        {step === 1 && (
          <div style={s.card}>
            <div style={s.cardTitle}>📋 Your Details</div>
            <div style={s.grid3}>
              <Field label="Full Name"  value={form.name}  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}  placeholder="Rahul Sharma" />
              <Field label="Phone"      value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+91 9876543210" type="tel" />
              <Field label="Email"      value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="rahul@email.com" type="email" />
            </div>
            <div style={s.cardTitle}>🗓️ Trip Dates</div>
            <div style={s.grid2}>
              <Field label="Pickup Date" value={pickup} onChange={e => setPickup(e.target.value)} type="date" />
              <Field label="Return Date" value={ret}    onChange={e => setRet(e.target.value)}    type="date" />
            </div>
            <div style={s.cardTitle}>📍 Pickup Hub</div>
            <select style={s.select} value={hub} onChange={e => setHub(e.target.value)}>
              {[`${car.city} — Central Hub`, `${car.city} — Airport Hub`, 'Doorstep Delivery (+₹299)'].map(h => <option key={h}>{h}</option>)}
            </select>
            <button style={s.btnNext} onClick={() => setStep(2)}>Continue → Add-ons</button>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div style={s.card}>
            <div style={s.cardTitle}>🎯 Optional Add-ons</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
              {[{ key: 'gps', icon: '📡', label: 'GPS Navigation', price: 200 }, { key: 'child', icon: '🧒', label: 'Child Safety Seat', price: 300 }, { key: 'sanitize', icon: '🧼', label: 'Extra Sanitization Kit', price: 150 }].map(ex => (
                <div key={ex.key} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', background: extras[ex.key] ? 'rgba(255,107,0,.08)' : 'var(--dark3)', border: `1px solid ${extras[ex.key] ? 'var(--saffron)' : 'var(--border)'}`, borderRadius: 10, cursor: 'pointer' }} onClick={() => setExtras(e => ({ ...e, [ex.key]: !e[ex.key] }))}>
                  <span style={{ fontSize: 22 }}>{ex.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--white)' }}>{ex.label}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-dim)' }}>+₹{ex.price} one-time</div>
                  </div>
                  <div style={{ width: 22, height: 22, borderRadius: 6, border: `2px solid ${extras[ex.key] ? 'var(--saffron)' : 'var(--border)'}`, background: extras[ex.key] ? 'var(--saffron)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: 'white' }}>
                    {extras[ex.key] && '✓'}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button style={s.btnBack} onClick={() => setStep(1)}>← Back</button>
              <button style={{ ...s.btnNext, flex: 1 }} onClick={() => setStep(3)}>Continue → Payment</button>
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div style={s.card}>
            <div style={s.cardTitle}>💳 Payment Method</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 24 }}>
              {[{ id:'UPI',icon:'📲',label:'UPI / GPay' },{ id:'Card',icon:'💳',label:'Credit/Debit Card' },{ id:'NetBanking',icon:'🏦',label:'Net Banking' },{ id:'EMI',icon:'📅',label:'EMI (0% interest)' }].map(m => (
                <button key={m.id} onClick={() => setMethod(m.id)} style={{ flex: 1, minWidth: 130, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 8, background: method === m.id ? 'rgba(255,107,0,.1)' : 'var(--dark3)', border: `1px solid ${method === m.id ? 'var(--saffron)' : 'var(--border)'}`, borderRadius: 10, color: method === m.id ? 'var(--saffron)' : 'var(--text-muted)', fontSize: 13 }}>
                  <span style={{ fontSize: 20 }}>{m.icon}</span>{m.label}
                </button>
              ))}
            </div>
            <div style={s.cardTitle}>🎟️ Coupon Code</div>
            <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
              <input style={{ ...s.select, flex: 1 }} placeholder="Try DRIVEIN500" value={coupon} onChange={e => setCoupon(e.target.value.toUpperCase())} />
              <button style={{ padding: '10px 18px', background: 'var(--dark4)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: 8, fontSize: 13, fontWeight: 600 }} onClick={() => setDiscount(coupon === 'DRIVEIN500' ? 500 : 0)}>Apply</button>
            </div>
            {discount > 0 && <div style={{ padding: '8px 12px', background: 'rgba(34,197,94,.1)', border: '1px solid rgba(34,197,94,.2)', borderRadius: 8, fontSize: 13, color: 'var(--green)', marginBottom: 16 }}>✅ ₹{discount} coupon discount applied!</div>}
            <div style={{ display: 'flex', gap: 10 }}>
              <button style={s.btnBack} onClick={() => setStep(2)}>← Back</button>
              <button style={{ ...s.btnNext, flex: 1 }} onClick={confirm} disabled={loading}>
                {loading ? '⏳ Processing...' : `🔒 Pay ₹${total.toLocaleString()} via ${method}`}
              </button>
            </div>
          </div>
        )}

        {/* Step 4 - Success */}
        {step === 4 && (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: 72, marginBottom: 16 }}>🎉</div>
            <h2 style={{ fontFamily: "'Bebas Neue',cursive", fontSize: 46, color: 'var(--white)', letterSpacing: 1, marginBottom: 10 }}>BOOKING CONFIRMED!</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: 32, fontSize: 15 }}>{car.make} {car.model} · {days} day{days > 1 ? 's' : ''} · ₹{total.toLocaleString()}</p>
            <div style={{ background: 'var(--dark3)', border: '1px solid var(--border)', borderRadius: 16, padding: '24px 48px', display: 'inline-block', marginBottom: 28 }}>
              <div style={{ fontSize: 11, color: 'var(--text-dim)', letterSpacing: 1, marginBottom: 8 }}>PICKUP OTP — Show at hub</div>
              <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: 52, letterSpacing: 12, color: 'var(--saffron)' }}>{otp}</div>
            </div>
            <div style={{ fontSize: 13, color: 'var(--green)', marginBottom: 28 }}>✅ Booking details sent to your WhatsApp</div>
            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button style={{ ...s.btnNext, width: 'auto', padding: '12px 28px' }} onClick={() => navigate('/dashboard')}>View My Bookings →</button>
              <button style={{ ...s.btnBack, padding: '12px 28px' }} onClick={() => navigate('/cars')}>Book Another Car</button>
            </div>
          </div>
        )}
      </div>

      {/* Summary sidebar */}
      {step !== 4 && (
        <aside style={s.summary}>
          <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 17, fontWeight: 700, color: 'var(--white)', marginBottom: 18 }}>Order Summary</div>
          <div style={{ background: 'var(--dark3)', borderRadius: 10, padding: 14, marginBottom: 16 }}>
            <div style={{ fontSize: 10, color: 'var(--text-dim)', textTransform: 'uppercase' }}>{car.make}</div>
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 18, fontWeight: 700, color: 'var(--white)', margin: '3px 0 8px' }}>{car.model}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {[`👥 ${car.seats}`, `⛽ ${car.fuel}`, `⚙️ ${car.transmission}`, `📍 ${car.city}`].map(sp => (
                <span key={sp} style={{ fontSize: 11, color: 'var(--text-muted)', background: 'var(--dark4)', padding: '3px 8px', borderRadius: 4 }}>{sp}</span>
              ))}
            </div>
          </div>
          <div style={s.divider} />
          {[{ l: 'Pickup', v: pickup }, { l: 'Return', v: ret }, { l: 'Duration', v: `${days} day${days > 1 ? 's' : ''}` }].map(r => (
            <div key={r.l} style={s.sumRow}><span>{r.l}</span><span style={{ color: 'var(--white)', fontWeight: 500 }}>{r.v}</span></div>
          ))}
          <div style={s.divider} />
          <div style={s.sumRow}><span>₹{car.pricePerDay.toLocaleString()} × {days} days</span><span>₹{base.toLocaleString()}</span></div>
          {extrasTotal > 0 && <div style={s.sumRow}><span>Add-ons</span><span>₹{extrasTotal}</span></div>}
          <div style={{ ...s.sumRow, fontSize: 11, color: 'var(--text-dim)' }}><span>Insurance & taxes</span><span>Included</span></div>
          {discount > 0 && <div style={{ ...s.sumRow, color: 'var(--green)' }}><span>Coupon</span><span>−₹{discount}</span></div>}
          <div style={s.divider} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, color: 'var(--white)' }}>Total</span>
            <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 26, fontWeight: 800, color: 'var(--saffron)' }}>₹{total.toLocaleString()}</span>
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 12, textAlign: 'center' }}>🛡️ Insured · 🔒 Secure · ✅ Free Cancel 24h before</div>
        </aside>
      )}
    </div>
  )
}

function Field({ label, type = 'text', value, onChange, placeholder }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 11, fontWeight: 600, letterSpacing: .8, textTransform: 'uppercase', color: 'var(--text-dim)' }}>{label}</label>
      <input type={type} value={value} onChange={onChange} placeholder={placeholder}
        style={{ background: 'var(--dark3)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px', color: 'var(--white)', fontSize: 14, outline: 'none' }}
        onFocus={e => e.target.style.borderColor = 'var(--saffron)'}
        onBlur={e  => e.target.style.borderColor = 'var(--border)'}
      />
    </div>
  )
}

const s = {
  page:      { paddingTop: 'var(--nav-h)', minHeight: '100vh', display: 'flex', gap: 28, padding: 'var(--nav-h) 48px 60px', alignItems: 'flex-start' },
  left:      { flex: 1, minWidth: 0 },
  pageTitle: { fontFamily: "'Bebas Neue',cursive", fontSize: 48, letterSpacing: 1, color: 'var(--white)', marginBottom: 24 },
  card:      { background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: 28 },
  cardTitle: { fontFamily: "'Syne',sans-serif", fontSize: 15, fontWeight: 700, color: 'var(--white)', marginBottom: 16, marginTop: 20 },
  grid2:     { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 8 },
  grid3:     { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 14, marginBottom: 8 },
  select:    { width: '100%', background: 'var(--dark3)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px', color: 'var(--text)', fontSize: 14, outline: 'none', marginBottom: 20 },
  btnNext:   { width: '100%', marginTop: 20, padding: '13px', background: 'var(--saffron)', color: 'white', border: 'none', borderRadius: 10, fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 14 },
  btnBack:   { padding: '13px 22px', background: 'var(--dark3)', color: 'var(--text-muted)', border: '1px solid var(--border)', borderRadius: 10, fontSize: 14 },
  summary:   { width: 300, flexShrink: 0, background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: 24, position: 'sticky', top: 'calc(var(--nav-h) + 20px)' },
  divider:   { height: 1, background: 'var(--border)', margin: '14px 0' },
  sumRow:    { display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text-muted)', marginBottom: 8 },
}
