import { useState, useEffect, useCallback } from 'react'
import { carsAPI, bookingsAPI, MOCK_CARS, MOCK_BOOKINGS } from '../services/api'

// ── useToast ──────────────────────────────────────────────
export function useToast() {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = 'success', duration = 4000) => {
    const id = Date.now()
    setToasts(t => [...t, { id, message, type }])
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), duration)
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(t => t.filter(x => x.id !== id))
  }, [])

  return { toasts, addToast, removeToast }
}

// ── useCars ───────────────────────────────────────────────
export function useCars(filters = {}) {
  const [cars,    setCars]    = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      try {
        const res = await carsAPI.getAll(filters)
        setCars(res.data.cars)
      } catch {
        let list = [...MOCK_CARS]
        if (filters.type && filters.type !== 'All') list = list.filter(c => c.type === filters.type)
        if (filters.city) list = list.filter(c => c.city.toLowerCase().includes(filters.city.toLowerCase()))
        setCars(list)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [JSON.stringify(filters)])

  return { cars, loading, error }
}

// ── useBookings ───────────────────────────────────────────
export function useBookings() {
  const [bookings, setBookings] = useState([])
  const [loading,  setLoading]  = useState(true)

  const fetchBookings = async () => {
    setLoading(true)
    try {
      const res = await bookingsAPI.getMy()
      setBookings(res.data)
    } catch {
      setBookings(MOCK_BOOKINGS)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchBookings() }, [])

  const cancelBooking = async (id) => {
    try { await bookingsAPI.cancel(id) } catch {}
    setBookings(bs => bs.map(b => b._id === id ? { ...b, status: 'cancelled', paymentStatus: 'refunded' } : b))
  }

  return { bookings, loading, cancelBooking, refetch: fetchBookings }
}

// ── useLocalStorage ───────────────────────────────────────
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch { return initialValue }
  })

  const setValue = (value) => {
    try {
      const val = value instanceof Function ? value(storedValue) : value
      setStoredValue(val)
      localStorage.setItem(key, JSON.stringify(val))
    } catch (e) { console.error(e) }
  }

  return [storedValue, setValue]
}

// ── useDebounce ───────────────────────────────────────────
export function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debounced
}
