// controllers/authController.js
const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const User = require('../models/userModel');
const db = require('../config/db');

const router = express.Router();
router.use(bodyParser.json());

const secretKey = 'my-32-character-ultra-secure-and-ultra-long-secret';

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Received Login Request:', { email, password });

    const user = await User.findByEmail(email);

    console.log(user)
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const passwordMatch = await user.comparePassword(password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, secretKey, { expiresIn: '1h' });
    console.log('Generated Token:', token);

    res.status(200).json({ token });
  } catch (error) {
    console.error('Error in Login Route:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
