const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// Register
router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashed });
    await user.save();
    res.status(201).send('User registered');
  } catch (err) {
    res.status(400).send('Error: ' + err.message);
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send('Invalid credentials');
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).send('Invalid credentials');
    const token = jwt.sign({ id: user._id }, JWT_SECRET);
    res.json({ token });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
