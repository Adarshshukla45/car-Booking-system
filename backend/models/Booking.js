const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user:          { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  car:           { type: mongoose.Schema.Types.ObjectId, ref: 'Car',  required: true },
  pickupDate:    { type: Date,   required: true },
  returnDate:    { type: Date,   required: true },
  pickupHub:     { type: String, required: true },
  totalDays:     { type: Number, required: true },
  pricePerDay:   { type: Number, required: true },
  totalAmount:   { type: Number, required: true },
  discount:      { type: Number, default: 0 },
  finalAmount:   { type: Number, required: true },
  couponCode:    { type: String, default: '' },
  status:        { type: String, enum: ['pending','confirmed','active','completed','cancelled'], default: 'pending' },
  paymentStatus: { type: String, enum: ['pending','paid','refunded'], default: 'pending' },
  paymentMethod: { type: String, default: 'UPI' },
  extras:        [{ name: String, price: Number }],
  otp:           { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);