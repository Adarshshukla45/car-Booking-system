import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('di_token')
  if (token) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login:    (data) => api.post('/auth/login',    data),
}

export const carsAPI = {
  getAll:  (params) => api.get('/cars', { params }),
  getById: (id)     => api.get(`/cars/${id}`),
}

export const bookingsAPI = {
  create: (data) => api.post('/bookings',          data),
  getMy:  ()     => api.get('/bookings/my'),
  cancel: (id)   => api.put(`/bookings/${id}/cancel`),
}

export default api

// ── Mock Data (fallback when backend not running) ─────────
export const MOCK_CARS = [
  { _id:'1',  make:'Maruti Suzuki', model:'Swift',      type:'hatchback', seats:5, fuel:'Petrol',   transmission:'Manual',    pricePerDay:799,  rating:4.7, totalTrips:842,  city:'Delhi',     isAvailable:true, color:'#E8E8E8' },
  { _id:'2',  make:'Hyundai',       model:'i20',        type:'hatchback', seats:5, fuel:'Petrol',   transmission:'Automatic', pricePerDay:999,  rating:4.8, totalTrips:312,  city:'Mumbai',    isAvailable:true, color:'#B8D8FF' },
  { _id:'3',  make:'Honda',         model:'City',       type:'sedan',     seats:5, fuel:'Petrol',   transmission:'Automatic', pricePerDay:1299, rating:4.6, totalTrips:1204, city:'Bangalore', isAvailable:true, color:'#FFD090' },
  { _id:'4',  make:'Hyundai',       model:'Creta',      type:'suv',       seats:5, fuel:'Diesel',   transmission:'Automatic', pricePerDay:1599, rating:4.9, totalTrips:668,  city:'Delhi',     isAvailable:true, color:'#B0B8FF' },
  { _id:'5',  make:'Tata',          model:'Nexon EV',   type:'ev',        seats:5, fuel:'Electric', transmission:'Automatic', pricePerDay:1799, rating:4.8, totalTrips:214,  city:'Mumbai',    isAvailable:true, color:'#A0FFD0' },
  { _id:'6',  make:'Toyota',        model:'Fortuner',   type:'suv',       seats:7, fuel:'Diesel',   transmission:'Automatic', pricePerDay:3499, rating:4.9, totalTrips:388,  city:'Goa',       isAvailable:true, color:'#282828' },
  { _id:'7',  make:'BMW',           model:'3 Series',   type:'luxury',    seats:5, fuel:'Petrol',   transmission:'Automatic', pricePerDay:5999, rating:5.0, totalTrips:92,   city:'Mumbai',    isAvailable:true, color:'#181820' },
  { _id:'8',  make:'Maruti Suzuki', model:'Ertiga',     type:'mpv',       seats:7, fuel:'CNG',      transmission:'Manual',    pricePerDay:1199, rating:4.5, totalTrips:554,  city:'Jaipur',    isAvailable:true, color:'#E0E0D8' },
  { _id:'9',  make:'Kia',           model:'Seltos',     type:'suv',       seats:5, fuel:'Petrol',   transmission:'Automatic', pricePerDay:1899, rating:4.7, totalTrips:441,  city:'Hyderabad', isAvailable:true, color:'#FFB090' },
  { _id:'10', make:'MG',            model:'Hector',     type:'suv',       seats:5, fuel:'Petrol',   transmission:'Automatic', pricePerDay:2199, rating:4.6, totalTrips:298,  city:'Bangalore', isAvailable:true, color:'#E8E0D8' },
  { _id:'11', make:'Tata',          model:'Harrier',    type:'suv',       seats:5, fuel:'Diesel',   transmission:'Automatic', pricePerDay:2499, rating:4.8, totalTrips:187,  city:'Delhi',     isAvailable:true, color:'#303030' },
  { _id:'12', make:'Honda',         model:'Amaze',      type:'sedan',     seats:5, fuel:'Petrol',   transmission:'Manual',    pricePerDay:999,  rating:4.4, totalTrips:723,  city:'Chennai',   isAvailable:true, color:'#F0F0F0' },
]

export const MOCK_BOOKINGS = [
  { _id:'b1', car:{ make:'Hyundai',        model:'Creta',    type:'suv',       city:'Delhi',   pricePerDay:1599 }, pickupDate:'2025-02-10', returnDate:'2025-02-13', totalDays:3, finalAmount:4797, status:'completed', paymentStatus:'paid',     pickupHub:'Delhi — Connaught Place' },
  { _id:'b2', car:{ make:'Tata',           model:'Nexon EV', type:'ev',        city:'Mumbai',  pricePerDay:1799 }, pickupDate:'2025-03-22', returnDate:'2025-03-25', totalDays:3, finalAmount:4897, status:'confirmed', paymentStatus:'paid',     pickupHub:'Mumbai — BKC Hub' },
  { _id:'b3', car:{ make:'Maruti Suzuki',  model:'Swift',    type:'hatchback', city:'Goa',     pricePerDay:799  }, pickupDate:'2025-01-05', returnDate:'2025-01-08', totalDays:3, finalAmount:1897, status:'completed', paymentStatus:'paid',     pickupHub:'Goa — Panaji Hub' },
]
