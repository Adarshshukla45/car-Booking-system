import { useState } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import AuthModal from './components/AuthModal'
import ToastContainer from './components/Toast'
import Home from './pages/Home'
import Cars from './pages/Cars'
import CarDetail from './pages/CarDetail'
import Checkout from './pages/Checkout'
import Dashboard from './pages/Dashboard'

function Layout() {
  const [authModal, setAuthModal] = useState(null)
  const [toasts,    setToasts]    = useState([])
  const location = useLocation()
  const isDash   = location.pathname === '/dashboard'

  const addToast = (message, type = 'success') => {
    const id = Date.now()
    setToasts(t => [...t, { id, message, type }])
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 4000)
  }

  return (
    <>
      <Navbar onAuthOpen={(mode) => setAuthModal(mode)} />

      <Routes>
        <Route path="/"             element={<Home      onAuthOpen={setAuthModal} />} />
        <Route path="/cars"         element={<Cars      onAuthOpen={setAuthModal} />} />
        <Route path="/cars/:id"     element={<CarDetail onAuthOpen={setAuthModal} />} />
        <Route path="/checkout/:id" element={<Checkout  onAuthOpen={setAuthModal} />} />
        <Route path="/dashboard"    element={<Dashboard />} />
        <Route path="*"             element={<NotFound />} />
      </Routes>

      {!isDash && <Footer />}

      {authModal && (
        <AuthModal mode={authModal} onClose={() => setAuthModal(null)} />
      )}

      <ToastContainer
        toasts={toasts}
        onRemove={(id) => setToasts(t => t.filter(x => x.id !== id))}
      />
    </>
  )
}

function NotFound() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 14,
      paddingTop: 'var(--nav-h)',
    }}>
      <div style={{ fontSize: 80 }}>🚗</div>
      <h1 style={{
        fontFamily: "'Bebas Neue',cursive", fontSize: 72,
        color: 'var(--white)', letterSpacing: 2, lineHeight: 1,
      }}>404</h1>
      <p style={{
        fontFamily: "'Bebas Neue',cursive", fontSize: 28,
        color: 'var(--saffron)', letterSpacing: 3,
      }}>ROAD NOT FOUND</p>
      <p style={{ color: 'var(--text-muted)', fontSize: 15, marginTop: 4 }}>
        This route doesn't exist. Let's get you back on track.
      </p>
      <a href="/" style={{
        marginTop: 14, padding: '12px 32px',
        background: 'var(--saffron)', color: 'white',
        borderRadius: 8, fontFamily: "'Syne',sans-serif",
        fontWeight: 700, fontSize: 14,
      }}>← Go Home</a>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </AuthProvider>
  )
}
