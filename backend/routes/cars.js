const express = require('express');
const Car     = require('../models/Car');
const { protect, adminOnly } = require('../middleware/auth');
const router  = express.Router();

// GET /api/cars
router.get('/', async (req, res) => {
  try {
    const { city, type, fuel, transmission, minPrice, maxPrice, seats } = req.query;
    const query = { isAvailable: true };
    if (city)         query.city         = new RegExp(city, 'i');
    if (type)         query.type         = type;
    if (fuel)         query.fuel         = fuel;
    if (transmission) query.transmission = transmission;
    if (seats)        query.seats        = { $gte: Number(seats) };
    if (minPrice || maxPrice) {
      query.pricePerDay = {};
      if (minPrice) query.pricePerDay.$gte = Number(minPrice);
      if (maxPrice) query.pricePerDay.$lte = Number(maxPrice);
    }
    const cars = await Car.find(query).sort({ rating: -1 });
    res.json({ count: cars.length, cars });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// GET /api/cars/:id
router.get('/:id', async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ message: 'Car not found' });
    res.json(car);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// POST /api/cars (Admin)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const car = await Car.create(req.body);
    res.status(201).json(car);
  } catch (e) { res.status(400).json({ message: e.message }); }
});

// PUT /api/cars/:id (Admin)
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const car = await Car.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!car) return res.status(404).json({ message: 'Car not found' });
    res.json(car);
  } catch (e) { res.status(400).json({ message: e.message }); }
});

// DELETE /api/cars/:id (Admin)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Car.findByIdAndDelete(req.params.id);
    res.json({ message: 'Car deleted' });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;