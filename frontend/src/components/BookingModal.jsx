import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { bookingsAPI } from '../services/api'

const HUBS = {
  Delhi:     ['Connaught Place Hub', 'Aerocity Hub', 'Dwarka Hub', 'Doorstep Delivery (+₹299)'],
  Mumbai:    ['BKC Hub', 'Andheri Hub', 'Doorstep Delivery (+₹299)'],
  Bangalore: ['Indiranagar Hub', 'Whitefield Hub', 'Doorstep Delivery (+₹299)'],
  Goa:       ['Panaji Hub', 'Calangute Hub', 'Doorstep Delivery (+₹299)'],
  default:   ['City Centre Hub', 'Airport Hub', 'Doorstep Delivery (+₹299)'],
}

export default function BookingModal({ car, onClose, onSuccess }) {
  const { isAuth } = useAuth()
  const navigate   = useNavigate()
  const today = new Date()
  const fmt   = d  => d.toISOString().split('T')[0]

  const [pickup,   setPickup]   = useState(fmt(new Date(today.getTime() + 86400000)))
  const [ret,      setRet]      = useState(fmt(new Date(today.getTime() + 4 * 86400000)))
  const [hub,      setHub]      = useState('')
  const [method,   setMethod]   = useState('UPI')
  const [coupon,   setCoupon]   = useState('')
  const [discount, setDiscount] = useState(0)
  const [loading,  setLoading]  = useState(false)
  const [step,     setStep]     = useState(1) // 1=details 2=payment 3=success

  const hubs = HUBS[car.city] || HUBS.default
  useEffect(() => setHub(hubs[0]), [car.city])

  const days  = Math.max(1, Math.ceil((new Date(ret) - new Date(pickup)) / 86400000))
  const base  = days * car.pricePerDay
  const total = base - discount

  const applyCoupon = () => setDiscount(coupon.toUpperCase() === 'DRIVEIN500' ? 500 : 0)

  const confirm = async () => {
    setLoading(true)
    try { await bookingsAPI.create({ carId: car._id, pickupDate: pickup, returnDate: ret, pickupHub: hub, paymentMethod: method, couponCode: coupon }) }
    catch {}
    setLoading(false)
    setStep(3)
  }

  const otp = 7384

  return (
    <div style={s.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={s.modal}>
        <button style={s.close} onClick={onClose}>✕</button>

        {step === 3 ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: 64, marginBottom: 14 }}>🎉</div>
            <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: 38, color: 'var(--white)', letterSpacing: 1, marginBottom: 8 }}>BOOKING CONFIRMED!</div>
            <div style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 24 }}>{car.make} {car.model} · {days} day{days > 1 ? 's' : ''} · ₹{total.toLocaleString()}</div>
            <div style={{ background: 'var(--dark3)', border: '1px solid var(--border)', borderRadius: 14, padding: '18px 32px', display: 'inline-block', marginBottom: 20 }}>
              <div style={{ fontSize: 11, color: 'var(--text-dim)', letterSpacing: 1 }}>PICKUP OTP</div>
              <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: 48, letterSpacing: 10, color: 'var(--saffron)' }}>{otp}</div>
              <div style={{ fontSize: 11, color: 'var(--text-dim)' }}>Show at hub</div>
            </div>
            <div style={{ fontSize: 13, color: 'var(--green)', marginBottom: 24 }}>✅ Details sent to your WhatsApp</div>
            <button style={s.btnFull} onClick={() => { onClose(); onSuccess?.(); navigate('/dashboard') }}>View My Bookings →</button>
          </div>
        ) : (
          <>
            <div style={s.title}>BOOK YOUR RIDE</div>
            <div style={{ fontSize: 13, color: 'var(--saffron)', marginBottom: 20 }}>{car.make} {car.model} · {car.type} · {car.city}</div>

            {/* Progress */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
              {['Trip Details', 'Payment'].map((lbl, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 26, height: 26, borderRadius: '50%', background: step >= i + 1 ? 'var(--saffron)' : 'var(--dark4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: 'white', flexShrink: 0 }}>
                    {step > i + 1 ? '✓' : i + 1}
                  </div>
                  <span style={{ fontSize: 12, color: step === i + 1 ? 'var(--white)' : 'var(--text-dim)', fontWeight: step === i + 1 ? 600 : 400 }}>{lbl}</span>
                  {i < 1 && <div style={{ flex: 1, height: 1, background: step > i + 1 ? 'var(--saffron)' : 'var(--border)', minWidth: 40 }} />}
                </div>
              ))}
            </div>

            {step === 1 && (
              <div style={s.form}>
                <div style={s.row}>
                  <div style={{ flex: 1 }}>
                    <label style={s.label}>📅 Pickup Date</label>
                    <input type="date" style={s.input} value={pickup} min={fmt(new Date(today.getTime() + 86400000))} onChange={e => setPickup(e.target.value)} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={s.label}>📅 Return Date</label>
                    <input type="date" style={s.input} value={ret} min={pickup} onChange={e => setRet(e.target.value)} />
                  </div>
                </div>
                <div>
                  <label style={s.label}>📍 Pickup Hub</label>
                  <select style={s.input} value={hub} onChange={e => setHub(e.target.value)}>
                    {hubs.map(h => <option key={h}>{h}</option>)}
                  </select>
                </div>
                <PriceBox base={base} days={days} ppd={car.pricePerDay} discount={discount} total={total} />
                <button style={s.btnFull} onClick={() => setStep(2)}>Continue to Payment →</button>
              </div>
            )}

            {step === 2 && (
              <div style={s.form}>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', padding: '10px 14px', background: 'var(--dark3)', borderRadius: 8 }}>
                  🗓️ {pickup} → {ret} &nbsp;|&nbsp; 📍 {hub}
                </div>
                <div>
                  <label style={s.label}>💳 Payment Method</label>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
                    {[{ id:'UPI',icon:'📲' },{ id:'Card',icon:'💳' },{ id:'NetBanking',icon:'🏦' },{ id:'EMI',icon:'📅' }].map(m => (
                      <button key={m.id} onClick={() => setMethod(m.id)} style={{ padding: '8px 14px', border: `1px solid ${method === m.id ? 'var(--saffron)' : 'var(--border)'}`, background: method === m.id ? 'rgba(255,107,0,.1)' : 'var(--dark3)', color: method === m.id ? 'var(--saffron)' : 'var(--text-muted)', borderRadius: 8, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                        {m.icon} {m.id}
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input style={{ ...s.input, flex: 1 }} placeholder="Coupon (try DRIVEIN500)" value={coupon} onChange={e => setCoupon(e.target.value.toUpperCase())} />
                  <button style={{ padding: '10px 16px', background: 'var(--dark4)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: 8, fontSize: 13, fontWeight: 600 }} onClick={applyCoupon}>Apply</button>
                </div>
                {discount > 0 && <div style={{ padding: '8px 12px', background: 'rgba(34,197,94,.1)', border: '1px solid rgba(34,197,94,.2)', borderRadius: 8, fontSize: 13, color: 'var(--green)' }}>✅ ₹{discount} off applied!</div>}
                <PriceBox base={base} days={days} ppd={car.pricePerDay} discount={discount} total={total} />
                <div style={{ display: 'flex', gap: 10 }}>
                  <button style={s.btnBack} onClick={() => setStep(1)}>← Back</button>
                  <button style={{ ...s.btnFull, flex: 1 }} onClick={confirm} disabled={loading}>
                    {loading ? '⏳ Processing...' : `✅ Pay ₹${total.toLocaleString()} via ${method}`}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function PriceBox({ base, days, ppd, discount, total }) {
  return (
    <div style={{ background: 'rgba(255,107,0,.06)', border: '1px solid var(--border-accent)', borderRadius: 10, padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text-muted)', marginBottom: 6 }}>
        <span>₹{ppd.toLocaleString()} × {days} day{days > 1 ? 's' : ''}</span><span>₹{base.toLocaleString()}</span>
      </div>
      {discount > 0 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--green)', marginBottom: 6 }}>
          <span>Coupon Discount</span><span>−₹{discount}</span>
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-accent)', paddingTop: 10, marginTop: 6 }}>
        <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, color: 'var(--white)' }}>Total (incl. insurance)</span>
        <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 20, fontWeight: 800, color: 'var(--saffron)' }}>₹{total.toLocaleString()}</span>
      </div>
    </div>
  )
}

const s = {
  overlay: { position: 'fixed', inset: 0, zIndex: 500, background: 'rgba(0,0,0,.88)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, animation: 'fadeIn .2s ease' },
  modal:   { background: 'var(--dark2)', border: '1px solid var(--border)', borderRadius: 20, padding: '36px', width: '100%', maxWidth: 520, position: 'relative', animation: 'fadeUp .3s ease', maxHeight: '90vh', overflowY: 'auto' },
  close:   { position: 'absolute', top: 14, right: 14, width: 30, height: 30, borderRadius: '50%', background: 'var(--dark3)', border: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: 14 },
  title:   { fontFamily: "'Bebas Neue',cursive", fontSize: 32, color: 'var(--white)', letterSpacing: 1, marginBottom: 4 },
  form:    { display: 'flex', flexDirection: 'column', gap: 14 },
  row:     { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 },
  label:   { fontSize: 11, fontWeight: 600, letterSpacing: .8, textTransform: 'uppercase', color: 'var(--text-dim)', display: 'block', marginBottom: 6 },
  input:   { width: '100%', background: 'var(--dark3)', border: '1px solid var(--border)', borderRadius: 8, padding: '11px 14px', color: 'var(--white)', fontSize: 14, outline: 'none' },
  btnFull: { padding: '13px', background: 'var(--saffron)', color: 'white', border: 'none', borderRadius: 10, fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 14 },
  btnBack: { padding: '13px 20px', background: 'var(--dark3)', color: 'var(--text-muted)', border: '1px solid var(--border)', borderRadius: 10, fontSize: 14 },
}
