const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  make:         { type: String, required: true },
  model:        { type: String, required: true },
  type:         { type: String, required: true, enum: ['hatchback','sedan','suv','luxury','ev','mpv'] },
  year:         { type: Number, required: true },
  color:        { type: String, default: '#E0E0E0' },
  fuel:         { type: String, required: true, enum: ['Petrol','Diesel','CNG','Electric','Hybrid'] },
  transmission: { type: String, required: true, enum: ['Manual','Automatic'] },
  seats:        { type: Number, default: 5 },
  pricePerDay:  { type: Number, required: true },
  city:         { type: String, required: true },
  location:     { type: String, required: true },
  images:       [String],
  rating:       { type: Number, default: 4.5 },
  totalTrips:   { type: Number, default: 0 },
  isAvailable:  { type: Boolean, default: true },
  features:     [String],
  registrationNo: { type: String, sparse: true },
}, { timestamps: true });

module.exports = mongoose.model('Car', carSchema);