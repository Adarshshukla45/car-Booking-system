const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
const dotenv   = require('dotenv');
const morgan   = require('morgan');

dotenv.config();

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth',     require('./routes/auth'));
app.use('/api/cars',     require('./routes/cars'));
app.use('/api/bookings', require('./routes/bookings'));

app.get('/', (req, res) => res.json({ message: '🚗 DriveIndia API Running!', status: 'OK' }));

app.use((req, res) => res.status(404).json({ message: 'Route not found' }));
app.use((err, req, res, next) => res.status(500).json({ message: err.message }));

const PORT = process.env.PORT || 5000;

// mongoose.connect — NO useNewUrlParser (deprecated in mongoose 7+)
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected');
    app.listen(PORT, () => console.log(`🚀 Server: http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error('❌ DB Error:', err.message);
    process.exit(1);
  });