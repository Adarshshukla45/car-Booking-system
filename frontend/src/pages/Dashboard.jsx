import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { MOCK_BOOKINGS } from '../services/api'

const STATUS = {
  confirmed: { label: 'Confirmed', bg: 'rgba(34,197,94,.12)',   color: '#22C55E', border: 'rgba(34,197,94,.25)' },
  active:    { label: 'Active',    bg: 'rgba(255,107,0,.12)',   color: '#FF6B00', border: 'rgba(255,107,0,.3)'  },
  completed: { label: 'Completed', bg: 'rgba(100,116,139,.12)', color: '#94A3B8', border: 'rgba(100,116,139,.2)'},
  cancelled: { label: 'Cancelled', bg: 'rgba(239,68,68,.12)',   color: '#EF4444', border: 'rgba(239,68,68,.25)' },
  pending:   { label: 'Pending',   bg: 'rgba(245,197,24,.12)',  color: '#F5C518', border: 'rgba(245,197,24,.25)' },
}

const TABS = ['Overview','My Bookings','Saved Cars','Profile']

export default function Dashboard() {
  const { user, isAuth, logout } = useAuth()
  const navigate = useNavigate()
  const [tab,      setTab]      = useState('Overview')
  const [bookings, setBookings] = useState(MOCK_BOOKINGS)
  const [cancelId, setCancelId] = useState(null)

  useEffect(() => { if (!isAuth) navigate('/') }, [isAuth])
  if (!isAuth) return null

  const stats = {
    total:     bookings.length,
    completed: bookings.filter(b => b.status === 'completed').length,
    upcoming:  bookings.filter(b => b.status === 'confirmed').length,
    spent:     bookings.reduce((s, b) => s + b.finalAmount, 0),
  }

  const handleCancel = id => {
    setBookings(bs => bs.map(b => b._id === id ? { ...b, status: 'cancelled', paymentStatus: 'refunded' } : b))
    setCancelId(null)
  }

  return (
    <div style={s.page}>
      {/* Sidebar */}
      <aside style={s.sidebar}>
        <div style={s.profileBox}>
          <div style={s.avatar}>{user?.name?.[0]?.toUpperCase() || 'U'}</div>
          <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 16, fontWeight: 700, color: 'var(--white)', marginBottom: 4 }}>{user?.name}</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 10 }}>{user?.email}</div>
          <span style={{ padding: '4px 12px', background: 'rgba(255,107,0,.1)', border: '1px solid var(--border-accent)', borderRadius: 20, fontSize: 11, color: 'var(--saffron)', fontWeight: 600 }}>⭐ DriveIndia Member</span>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
          {[['Overview','📊'],['My Bookings','🚗'],['Saved Cars','❤️'],['Profile','👤']].map(([t, icon]) => (
            <button key={t} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', borderRadius: 10, background: tab === t ? 'rgba(255,107,0,.1)' : 'transparent', border: 'none', color: tab === t ? 'var(--saffron)' : 'var(--text-muted)', fontSize: 14, fontWeight: tab === t ? 600 : 500, textAlign: 'left' }} onClick={() => setTab(t)}>
              <span>{icon}</span>{t}
            </button>
          ))}
        </nav>

        <button style={{ marginTop: 24, padding: '11px 14px', background: 'transparent', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text-muted)', fontSize: 13, textAlign: 'left' }} onClick={() => { logout(); navigate('/') }}>
          🚪 Logout
        </button>
      </aside>

      {/* Main */}
      <main style={s.main}>

        {/* ── OVERVIEW ── */}
        {tab === 'Overview' && (
          <div style={{ animation: 'fadeUp .4s ease' }}>
            <div style={s.head}>
              <h2 style={s.title}>WELCOME BACK, <span style={{ color: 'var(--saffron)' }}>{user?.name?.split(' ')[0].toUpperCase()}</span>!</h2>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 4 }}>Here's your DriveIndia activity overview</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: 16, marginBottom: 36 }}>
              {[{ label:'Total Trips', val:stats.total, icon:'🚗', accent:false }, { label:'Completed', val:stats.completed, icon:'✅', accent:false }, { label:'Upcoming', val:stats.upcoming, icon:'📅', accent:true }, { label:'Total Spent', val:`₹${stats.spent.toLocaleString()}`, icon:'💰', accent:false }].map(st => (
                <div key={st.label} style={{ background: st.accent ? 'rgba(255,107,0,.06)' : 'var(--card)', border: `1px solid ${st.accent ? 'var(--border-accent)' : 'var(--border)'}`, borderRadius: 14, padding: '22px 20px' }}>
                  <div style={{ fontSize: 28, marginBottom: 10 }}>{st.icon}</div>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 26, fontWeight: 800, color: st.accent ? 'var(--saffron)' : 'var(--white)', lineHeight: 1 }}>{st.val}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>{st.label}</div>
                </div>
              ))}
            </div>
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 15, fontWeight: 700, color: 'var(--white)', marginBottom: 16 }}>Recent Bookings</div>
            {bookings.slice(0, 2).map(b => <MiniRow key={b._id} b={b} />)}
            <button style={{ fontSize: 13, color: 'var(--saffron)', background: 'none', border: 'none', cursor: 'pointer', marginTop: 8, fontWeight: 600 }} onClick={() => setTab('My Bookings')}>View All Bookings →</button>
          </div>
        )}

        {/* ── MY BOOKINGS ── */}
        {tab === 'My Bookings' && (
          <div style={{ animation: 'fadeUp .4s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28, flexWrap: 'wrap', gap: 14 }}>
              <h2 style={s.title}>MY <span style={{ color: 'var(--saffron)' }}>BOOKINGS</span></h2>
              <button style={s.btnNew} onClick={() => navigate('/cars')}>+ Book New Car</button>
            </div>
            {bookings.length === 0 ? (
              <div style={s.empty}><div style={{ fontSize: 60, marginBottom: 14 }}>🚗</div><div style={{ fontFamily: "'Syne',sans-serif", fontSize: 20, color: 'var(--white)', marginBottom: 8 }}>No bookings yet</div><button style={s.btnNew} onClick={() => navigate('/cars')}>Browse Cars →</button></div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {bookings.map(b => <BookingCard key={b._id} b={b} onCancel={() => setCancelId(b._id)} />)}
              </div>
            )}
          </div>
        )}

        {/* ── SAVED CARS ── */}
        {tab === 'Saved Cars' && (
          <div style={{ animation: 'fadeUp .4s ease' }}>
            <h2 style={{ ...s.title, marginBottom: 28 }}>SAVED <span style={{ color: 'var(--saffron)' }}>CARS</span></h2>
            <div style={s.empty}><div style={{ fontSize: 60, marginBottom: 14 }}>❤️</div><div style={{ fontFamily: "'Syne',sans-serif", fontSize: 20, color: 'var(--white)', marginBottom: 8 }}>No saved cars yet</div><div style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 20 }}>Tap 🤍 on any car to save it</div><button style={s.btnNew} onClick={() => navigate('/cars')}>Browse Cars →</button></div>
          </div>
        )}

        {/* ── PROFILE ── */}
        {tab === 'Profile' && (
          <div style={{ animation: 'fadeUp .4s ease' }}>
            <h2 style={{ ...s.title, marginBottom: 28 }}>MY <span style={{ color: 'var(--saffron)' }}>PROFILE</span></h2>
            <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: 24, display: 'flex', alignItems: 'center', gap: 18, marginBottom: 28, flexWrap: 'wrap' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg,var(--saffron),#FF8C38)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 700, color: 'white', flexShrink: 0 }}>{user?.name?.[0]?.toUpperCase()}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 22, fontWeight: 700, color: 'var(--white)', marginBottom: 4 }}>{user?.name}</div>
                <div style={{ fontSize: 14, color: 'var(--text-muted)' }}>{user?.email}</div>
                <div style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 4 }}>{user?.phone || '+91 XXXXXXXXXX'}</div>
              </div>
              <button style={{ padding: '9px 18px', background: 'var(--dark3)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: 8, fontSize: 13 }}>✏️ Edit Profile</button>
            </div>
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 15, fontWeight: 700, color: 'var(--white)', marginBottom: 14 }}>Account Settings</div>
            {['Change Password','Linked Aadhaar','Driving License','Notification Preferences','Delete Account'].map(item => (
              <div key={item} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, marginBottom: 8, fontSize: 14, color: 'var(--text)', cursor: 'pointer' }}>
                <span>{item}</span><span style={{ color: 'var(--text-dim)' }}>→</span>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Cancel confirm */}
      {cancelId && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 500 }}>
          <div style={{ background: 'var(--dark2)', border: '1px solid var(--border)', borderRadius: 16, padding: 36, textAlign: 'center', maxWidth: 360 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>⚠️</div>
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 20, fontWeight: 700, color: 'var(--white)', marginBottom: 8 }}>Cancel Booking?</div>
            <div style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 24 }}>Refund will be processed in 24 hrs.</div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button style={{ flex: 1, padding: '11px', background: 'var(--dark3)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: 9, fontSize: 14 }} onClick={() => setCancelId(null)}>Keep Booking</button>
              <button style={{ flex: 1, padding: '11px', background: 'rgba(239,68,68,.1)', border: '1px solid rgba(239,68,68,.3)', color: '#EF4444', borderRadius: 9, fontSize: 14, fontWeight: 600 }} onClick={() => handleCancel(cancelId)}>Yes, Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function MiniRow({ b }) {
  const cfg = STATUS[b.status] || STATUS.pending
  return (
    <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16, marginBottom: 10, flexWrap: 'wrap' }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 16, fontWeight: 700, color: 'var(--white)' }}>{b.car.make} {b.car.model}</div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>{b.pickupDate} → {b.returnDate} · {b.car.city}</div>
      </div>
      <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 18, fontWeight: 700, color: 'var(--saffron)' }}>₹{b.finalAmount.toLocaleString()}</div>
      <span style={{ padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>{cfg.label}</span>
    </div>
  )
}

function BookingCard({ b, onCancel }) {
  const [open, setOpen] = useState(false)
  const cfg = STATUS[b.status] || STATUS.pending
  return (
    <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
      <div style={{ padding: '18px 22px', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', cursor: 'pointer' }} onClick={() => setOpen(!open)}>
        <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(255,107,0,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>🚗</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 17, fontWeight: 700, color: 'var(--white)' }}>{b.car.make} {b.car.model}</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>{b.pickupDate} → {b.returnDate} · {b.car.city}</div>
        </div>
        <span style={{ padding: '5px 14px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>{cfg.label}</span>
        <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 20, fontWeight: 800, color: 'var(--saffron)' }}>₹{b.finalAmount.toLocaleString()}</div>
        <span style={{ color: 'var(--text-dim)', fontSize: 14 }}>{open ? '▲' : '▼'}</span>
      </div>
      {open && (
        <div style={{ padding: '0 22px 20px', borderTop: '1px solid var(--border)', paddingTop: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(150px,1fr))', gap: 12, marginBottom: 16 }}>
            {[{ l:'Duration', v:`${b.totalDays} day${b.totalDays>1?'s':''}` },{ l:'Payment', v:b.paymentStatus },{ l:'Hub', v:b.pickupHub }].map(d => (
              <div key={d.l}>
                <div style={{ fontSize: 10, color: 'var(--text-dim)', letterSpacing: .5, textTransform: 'uppercase', marginBottom: 4 }}>{d.l}</div>
                <div style={{ fontSize: 14, color: 'var(--white)', fontWeight: 500 }}>{d.v}</div>
              </div>
            ))}
          </div>
          {(b.status === 'confirmed' || b.status === 'pending') && (
            <button style={{ padding: '8px 20px', background: 'rgba(239,68,68,.1)', border: '1px solid rgba(239,68,68,.25)', color: '#EF4444', borderRadius: 8, fontSize: 13, fontWeight: 600 }} onClick={onCancel}>Cancel Booking</button>
          )}
          {b.status === 'completed' && (
            <button style={{ padding: '8px 20px', background: 'rgba(245,197,24,.1)', border: '1px solid rgba(245,197,24,.25)', color: '#F5C518', borderRadius: 8, fontSize: 13, fontWeight: 600 }}>⭐ Write Review</button>
          )}
        </div>
      )}
    </div>
  )
}

const s = {
  page:       { paddingTop: 'var(--nav-h)', minHeight: '100vh', display: 'flex' },
  sidebar:    { width: 260, flexShrink: 0, borderRight: '1px solid var(--border)', background: 'var(--dark2)', padding: '32px 24px', display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - var(--nav-h))', position: 'sticky', top: 'var(--nav-h)', height: 'calc(100vh - var(--nav-h))', overflowY: 'auto' },
  profileBox: { textAlign: 'center', marginBottom: 32, paddingBottom: 28, borderBottom: '1px solid var(--border)' },
  avatar:     { width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg,var(--saffron),#FF8C38)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 700, color: 'white', margin: '0 auto 14px', boxShadow: '0 8px 24px rgba(255,107,0,.35)' },
  main:       { flex: 1, padding: '40px 48px 60px', minWidth: 0 },
  head:       { marginBottom: 32 },
  title:      { fontFamily: "'Bebas Neue',cursive", fontSize: 46, letterSpacing: 1, color: 'var(--white)', lineHeight: 1 },
  btnNew:     { padding: '10px 22px', background: 'var(--saffron)', color: 'white', border: 'none', borderRadius: 8, fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 13 },
  empty:      { padding: '60px 0', textAlign: 'center' },
}
