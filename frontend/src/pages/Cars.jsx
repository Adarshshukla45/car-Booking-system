import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import CarCard from '../components/CarCard'
import BookingModal from '../components/BookingModal'
import { MOCK_CARS } from '../services/api'

const TYPES  = ['All','hatchback','sedan','suv','luxury','ev','mpv']
const ICONS  = { All:'🚗', hatchback:'🚙', sedan:'🚘', suv:'🛻', luxury:'👑', ev:'⚡', mpv:'🚐' }
const CITIES = ['All Cities','Delhi','Mumbai','Bangalore','Hyderabad','Chennai','Jaipur','Goa','Pune','Kochi']
const SORTS  = ['Popular','Price: Low → High','Price: High → Low','Rating','Most Trips']

export default function Cars() {
  const [searchParams] = useSearchParams()
  const [bookCar, setBookCar] = useState(null)

  const [type,   setType]   = useState('All')
  const [city,   setCity]   = useState(searchParams.get('city') || 'All Cities')
  const [fuel,   setFuel]   = useState('All')
  const [trans,  setTrans]  = useState('All')
  const [sort,   setSort]   = useState('Popular')
  const [minP,   setMinP]   = useState('')
  const [maxP,   setMaxP]   = useState('')
  const [search, setSearch] = useState('')
  const [sideOpen, setSideOpen] = useState(true)

  const filtered = useMemo(() => {
    let list = [...MOCK_CARS]
    if (type !== 'All')        list = list.filter(c => c.type === type)
    if (city !== 'All Cities') list = list.filter(c => c.city.toLowerCase().includes(city.toLowerCase()))
    if (fuel !== 'All')        list = list.filter(c => c.fuel === fuel)
    if (trans !== 'All')       list = list.filter(c => c.transmission === trans)
    if (minP)                  list = list.filter(c => c.pricePerDay >= Number(minP))
    if (maxP)                  list = list.filter(c => c.pricePerDay <= Number(maxP))
    if (search)                list = list.filter(c => `${c.make} ${c.model}`.toLowerCase().includes(search.toLowerCase()))
    switch (sort) {
      case 'Price: Low → High':  list.sort((a,b) => a.pricePerDay - b.pricePerDay); break
      case 'Price: High → Low':  list.sort((a,b) => b.pricePerDay - a.pricePerDay); break
      case 'Rating':             list.sort((a,b) => b.rating      - a.rating);      break
      case 'Most Trips':         list.sort((a,b) => b.totalTrips  - a.totalTrips);  break
    }
    return list
  }, [type, city, fuel, trans, minP, maxP, sort, search])

  const reset = () => { setType('All'); setCity('All Cities'); setFuel('All'); setTrans('All'); setMinP(''); setMaxP(''); setSearch('') }

  return (
    <div style={{ paddingTop: 'var(--nav-h)', minHeight: '100vh' }}>
      {/* Header */}
      <div style={s.header}>
        <div>
          <h1 style={s.pageTitle}>FIND YOUR <span style={{ color: 'var(--saffron)' }}>CAR</span></h1>
          <p style={s.pageSub}>{filtered.length} cars available</p>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <input style={s.searchInput} placeholder="🔍 Search make or model..." value={search} onChange={e => setSearch(e.target.value)} />
          <select style={s.select} value={sort} onChange={e => setSort(e.target.value)}>
            {SORTS.map(s => <option key={s}>{s}</option>)}
          </select>
          <button style={s.filterBtn} onClick={() => setSideOpen(!sideOpen)}>⚙️ Filters</button>
        </div>
      </div>

      {/* Type chips */}
      <div style={s.chips}>
        {TYPES.map(t => (
          <button key={t} style={{ ...s.chip, ...(type === t ? s.chipActive : {}) }} onClick={() => setType(t)}>
            {ICONS[t]} {t === 'All' ? 'All Cars' : t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      <div style={s.body}>
        {/* Sidebar */}
        {sideOpen && (
          <aside style={s.sidebar}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 15, fontWeight: 700, color: 'var(--white)' }}>Filters</span>
              <button style={{ fontSize: 12, color: 'var(--saffron)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }} onClick={reset}>Reset All</button>
            </div>

            <FGroup label="City">
              <select style={s.sideSelect} value={city} onChange={e => setCity(e.target.value)}>
                {CITIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </FGroup>

            <FGroup label="Fuel Type">
              {['All','Petrol','Diesel','CNG','Electric'].map(f => (
                <Btn key={f} active={fuel === f} onClick={() => setFuel(f)}>{f}</Btn>
              ))}
            </FGroup>

            <FGroup label="Transmission">
              {['All','Manual','Automatic'].map(t => (
                <Btn key={t} active={trans === t} onClick={() => setTrans(t)}>{t}</Btn>
              ))}
            </FGroup>

            <FGroup label="Price Range (₹/day)">
              <div style={{ display: 'flex', gap: 8 }}>
                <input style={s.priceInput} placeholder="Min" type="number" value={minP} onChange={e => setMinP(e.target.value)} />
                <input style={s.priceInput} placeholder="Max" type="number" value={maxP} onChange={e => setMaxP(e.target.value)} />
              </div>
            </FGroup>
          </aside>
        )}

        {/* Grid */}
        <main style={s.main}>
          {filtered.length === 0 ? (
            <div style={s.empty}>
              <div style={{ fontSize: 60, marginBottom: 14 }}>😕</div>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 20, color: 'var(--white)', marginBottom: 8 }}>No cars found</div>
              <div style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 20 }}>Try adjusting your filters</div>
              <button style={s.resetBtn} onClick={reset}>Reset Filters</button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 18 }}>
              {filtered.map((car, i) => (
                <div key={car._id} style={{ animation: `fadeUp .4s ${i * .05}s ease both` }}>
                  <CarCard car={car} onBook={setBookCar} />
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {bookCar && <BookingModal car={bookCar} onClose={() => setBookCar(null)} onSuccess={() => setBookCar(null)} />}
    </div>
  )
}

function FGroup({ label, children }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: 10 }}>{label}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>{children}</div>
    </div>
  )
}

function Btn({ active, onClick, children }) {
  return (
    <button onClick={onClick} style={{ padding: '5px 12px', background: active ? 'rgba(255,107,0,.1)' : 'var(--dark3)', border: `1px solid ${active ? 'var(--saffron)' : 'var(--border)'}`, borderRadius: 6, fontSize: 12, color: active ? 'var(--saffron)' : 'var(--text-muted)' }}>
      {children}
    </button>
  )
}

const s = {
  header: { padding: '28px 48px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 20 },
  pageTitle: { fontFamily: "'Bebas Neue',cursive", fontSize: 52, letterSpacing: 1, color: 'var(--white)', lineHeight: 1 },
  pageSub: { fontSize: 14, color: 'var(--text-muted)', marginTop: 4 },
  searchInput: { background: 'var(--dark3)', border: '1px solid var(--border)', borderRadius: 8, padding: '9px 14px', color: 'var(--white)', fontSize: 13, outline: 'none', width: 220 },
  select: { background: 'var(--dark3)', border: '1px solid var(--border)', borderRadius: 8, padding: '9px 12px', color: 'var(--text)', fontSize: 13, outline: 'none' },
  filterBtn: { padding: '9px 16px', background: 'var(--dark3)', border: '1px solid var(--border)', color: 'var(--text)', fontSize: 13, borderRadius: 8 },
  chips: { padding: '0 48px 18px', display: 'flex', gap: 8, flexWrap: 'wrap', borderBottom: '1px solid var(--border)' },
  chip: { padding: '7px 16px', background: 'var(--dark3)', border: '1px solid var(--border)', borderRadius: 100, fontSize: 12, color: 'var(--text-muted)' },
  chipActive: { background: 'rgba(255,107,0,.12)', borderColor: 'var(--border-accent)', color: 'var(--saffron)' },
  body: { display: 'flex', padding: '0 48px', gap: 28, paddingTop: 24 },
  sidebar: { width: 240, flexShrink: 0, background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: 22, height: 'fit-content', position: 'sticky', top: 'calc(var(--nav-h) + 20px)' },
  sideSelect: { width: '100%', background: 'var(--dark3)', border: '1px solid var(--border)', borderRadius: 7, padding: '9px 12px', color: 'var(--text)', fontSize: 13, outline: 'none' },
  priceInput: { flex: 1, background: 'var(--dark3)', border: '1px solid var(--border)', borderRadius: 7, padding: '8px 10px', color: 'var(--text)', fontSize: 13, outline: 'none' },
  main: { flex: 1, paddingBottom: 60 },
  empty: { padding: '80px 0', textAlign: 'center' },
  resetBtn: { padding: '10px 24px', background: 'var(--saffron)', color: 'white', border: 'none', borderRadius: 8, fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 14 },
}
