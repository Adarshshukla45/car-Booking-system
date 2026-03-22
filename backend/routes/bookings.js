const express = require('express');
const Booking = require('../models/Booking');
const Car     = require('../models/Car');
const { protect } = require('../middleware/auth');
const router  = express.Router();

// POST /api/bookings
router.post('/', protect, async (req, res) => {
  try {
    const { carId, pickupDate, returnDate, pickupHub, paymentMethod, couponCode, extras } = req.body;
    const car = await Car.findById(carId);
    if (!car)             return res.status(404).json({ message: 'Car not found' });
    if (!car.isAvailable) return res.status(400).json({ message: 'Car not available' });

    const days        = Math.max(1, Math.ceil((new Date(returnDate) - new Date(pickupDate)) / 86400000));
    const baseTotal   = days * car.pricePerDay;
    const extrasTotal = (extras || []).reduce((s, e) => s + (e.price || 0), 0);
    const discount    = couponCode === 'DRIVEIN500' ? 500 : 0;
    const finalAmount = Math.max(0, baseTotal + extrasTotal - discount);
    const otp         = Math.floor(1000 + Math.random() * 9000).toString();

    const booking = await Booking.create({
      user: req.user._id, car: carId,
      pickupDate, returnDate, pickupHub,
      totalDays: days, pricePerDay: car.pricePerDay,
      totalAmount: baseTotal + extrasTotal,
      discount, finalAmount,
      couponCode: couponCode || '',
      extras: extras || [],
      paymentMethod: paymentMethod || 'UPI',
      otp, status: 'confirmed', paymentStatus: 'paid'
    });

    await Car.findByIdAndUpdate(carId, { isAvailable: false });
    res.status(201).json({ booking, otp, message: 'Booking confirmed!' });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// GET /api/bookings/my
router.get('/my', protect, async (req, res) => {
  try {
    const bookings = await Booking
      .find({ user: req.user._id })
      .populate('car', 'make model type city pricePerDay color fuel transmission seats')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// GET /api/bookings/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, user: req.user._id }).populate('car');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// PUT /api/bookings/:id/cancel
router.put('/:id/cancel', protect, async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, user: req.user._id });
    if (!booking)                       return res.status(404).json({ message: 'Not found' });
    if (booking.status === 'active')    return res.status(400).json({ message: 'Cannot cancel active trip' });
    if (booking.status === 'cancelled') return res.status(400).json({ message: 'Already cancelled' });

    booking.status        = 'cancelled';
    booking.paymentStatus = 'refunded';
    await booking.save();
    await Car.findByIdAndUpdate(booking.car, { isAvailable: true });
    res.json({ message: 'Cancelled. Refund in 24 hrs.' });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;