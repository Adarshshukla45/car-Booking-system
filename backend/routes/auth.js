const express = require('express');
const jwt     = require('jsonwebtoken');
const User    = require('../models/User');
const { protect } = require('../middleware/auth');
const router  = express.Router();

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    if (!name || !email || !phone || !password)
      return res.status(400).json({ message: 'All fields required' });
    if (await User.findOne({ email }))
      return res.status(400).json({ message: 'Email already registered' });
    const user = await User.create({ name, email, phone, password });
    res.status(201).json({
      token: signToken(user._id),
      user: { id: user._id, name, email, phone, role: user.role }
    });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: 'Invalid credentials' });
    res.json({
      token: signToken(user._id),
      user: { id: user._id, name: user.name, email, phone: user.phone, role: user.role }
    });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// GET /api/auth/me
router.get('/me', protect, (req, res) => res.json(req.user));

module.exports = router;