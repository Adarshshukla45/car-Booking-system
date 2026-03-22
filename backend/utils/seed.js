// ── DriveIndia — Database Seeder ──────────────────────────
// Run: node utils/seed.js
// This will add 12 cars + 1 admin user to MongoDB

const mongoose = require('mongoose');
const dotenv   = require('dotenv');
dotenv.config({ path: '../.env' });

const Car  = require('../models/Car');
const User = require('../models/User');

const CARS = [
  {
    make: 'Maruti Suzuki', model: 'Swift',    type: 'hatchback', year: 2023,
    color: '#E8E8E8', fuel: 'Petrol',   transmission: 'Manual',    seats: 5,
    pricePerDay: 799,  city: 'Delhi',     location: 'Connaught Place Hub',
    rating: 4.7, totalTrips: 842, isAvailable: true,
    features: ['AC','Music System','Power Windows'],
  },
  {
    make: 'Hyundai', model: 'i20',         type: 'hatchback', year: 2023,
    color: '#B8D8FF', fuel: 'Petrol',   transmission: 'Automatic', seats: 5,
    pricePerDay: 999,  city: 'Mumbai',    location: 'BKC Hub',
    rating: 4.8, totalTrips: 312, isAvailable: true,
    features: ['AC','Sunroof','Bluetooth','Reverse Camera'],
  },
  {
    make: 'Honda', model: 'City',           type: 'sedan',     year: 2022,
    color: '#FFD090', fuel: 'Petrol',   transmission: 'Automatic', seats: 5,
    pricePerDay: 1299, city: 'Bangalore', location: 'Indiranagar Hub',
    rating: 4.6, totalTrips: 1204, isAvailable: true,
    features: ['AC','GPS','Cruise Control','USB Ports'],
  },
  {
    make: 'Hyundai', model: 'Creta',        type: 'suv',       year: 2023,
    color: '#B0B8FF', fuel: 'Diesel',   transmission: 'Automatic', seats: 5,
    pricePerDay: 1599, city: 'Delhi',     location: 'Aerocity Hub',
    rating: 4.9, totalTrips: 668, isAvailable: true,
    features: ['AC','Sunroof','GPS','Reverse Camera','Wireless Charging'],
  },
  {
    make: 'Tata', model: 'Nexon EV',        type: 'ev',        year: 2023,
    color: '#A0FFD0', fuel: 'Electric', transmission: 'Automatic', seats: 5,
    pricePerDay: 1799, city: 'Mumbai',    location: 'Andheri Hub',
    rating: 4.8, totalTrips: 214, isAvailable: true,
    features: ['AC','Fast Charging','GPS','Regenerative Braking'],
  },
  {
    make: 'Toyota', model: 'Fortuner',      type: 'suv',       year: 2022,
    color: '#282828', fuel: 'Diesel',   transmission: 'Automatic', seats: 7,
    pricePerDay: 3499, city: 'Goa',       location: 'Panaji Hub',
    rating: 4.9, totalTrips: 388, isAvailable: true,
    features: ['AC','4WD','GPS','7 Seats','Leather Seats'],
  },
  {
    make: 'BMW', model: '3 Series',         type: 'luxury',    year: 2023,
    color: '#181820', fuel: 'Petrol',   transmission: 'Automatic', seats: 5,
    pricePerDay: 5999, city: 'Mumbai',    location: 'Bandra Hub',
    rating: 5.0, totalTrips: 92, isAvailable: true,
    features: ['AC','Sunroof','Leather Seats','Harman Kardon','Ambient Lighting'],
  },
  {
    make: 'Maruti Suzuki', model: 'Ertiga', type: 'mpv',       year: 2022,
    color: '#E0E0D8', fuel: 'CNG',      transmission: 'Manual',    seats: 7,
    pricePerDay: 1199, city: 'Jaipur',   location: 'City Centre Hub',
    rating: 4.5, totalTrips: 554, isAvailable: true,
    features: ['AC','7 Seats','Music System','Power Windows'],
  },
  {
    make: 'Kia', model: 'Seltos',           type: 'suv',       year: 2023,
    color: '#FFB090', fuel: 'Petrol',   transmission: 'Automatic', seats: 5,
    pricePerDay: 1899, city: 'Hyderabad', location: 'HITEC City Hub',
    rating: 4.7, totalTrips: 441, isAvailable: true,
    features: ['AC','Sunroof','GPS','Wireless Charging','Ventilated Seats'],
  },
  {
    make: 'MG', model: 'Hector',            type: 'suv',       year: 2022,
    color: '#E8E0D8', fuel: 'Petrol',   transmission: 'Automatic', seats: 5,
    pricePerDay: 2199, city: 'Bangalore', location: 'Whitefield Hub',
    rating: 4.6, totalTrips: 298, isAvailable: true,
    features: ['AC','Panoramic Sunroof','Internet Car','GPS','ADAS'],
  },
  {
    make: 'Tata', model: 'Harrier',         type: 'suv',       year: 2023,
    color: '#303030', fuel: 'Diesel',   transmission: 'Automatic', seats: 5,
    pricePerDay: 2499, city: 'Delhi',     location: 'Dwarka Hub',
    rating: 4.8, totalTrips: 187, isAvailable: true,
    features: ['AC','Sunroof','GPS','JBL Sound','360 Camera'],
  },
  {
    make: 'Honda', model: 'Amaze',          type: 'sedan',     year: 2022,
    color: '#F0F0F0', fuel: 'Petrol',   transmission: 'Manual',    seats: 5,
    pricePerDay: 999,  city: 'Chennai',   location: 'T Nagar Hub',
    rating: 4.4, totalTrips: 723, isAvailable: true,
    features: ['AC','Bluetooth','USB','Power Windows'],
  },
];

const ADMIN = {
  name:     'Admin DriveIndia',
  email:    'admin@driveindia.com',
  phone:    '9999999999',
  password: 'Admin@123',
  role:     'admin',
};

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Car.deleteMany({});
    await User.deleteMany({ role: 'admin' });
    console.log('🗑️  Cleared existing cars and admin');

    // Seed cars
    const cars = await Car.insertMany(CARS);
    console.log(`🚗 Seeded ${cars.length} cars`);

    // Seed admin user
    const admin = await User.create(ADMIN);
    console.log(`👤 Admin created: ${admin.email} / password: Admin@123`);

    console.log('\n✅ Database seeded successfully!');
    console.log('📋 Admin login: admin@driveindia.com / Admin@123');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
}

seed();
