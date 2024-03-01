// registrationController.js
const express = require('express');
const bodyParser = require('body-parser');
const User = require('../models/userModel');
const Patient = require('../models/patientModel');
const Doctor = require('../models/doctorModel');

const router = express.Router();
router.use(bodyParser.json());

router.post('/', async (req, res) => {
  try {
    const { email, password, role, first_name, last_name, age, specialization } = req.body;

    // Create a new user
    const user = await User.createUser({ email, password, role, first_name, last_name });

    // Check the selected role and insert additional information
    if (role === 'patient') {
      await Patient.createPatient({ user_id: user.user_id, age });
    } else if (role === 'doctor') {
      await Doctor.createDoctor({ user_id: user.user_id, specialization });
    }

    res.status(201).json({ message: 'Registration successful' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
