// assessmentsController.js

const express = require('express');
const bodyParser = require('body-parser');
const Assessment = require('../models/assessmentModel');

const router = express.Router();
router.use(bodyParser.json());

// Get all Games
router.get('/', async (req, res) => {
    try {
      const games = await Assessment.getAllAssessments();
      res.json(games);
    } catch (error) {
      console.error('Error fetching Assessments:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.get('/:patientId', async (req, res) => {
  try {
    const patientId = req.params.patientId;
    const assessment = await Assessment.getAssessmentById(patientId);

    if (!assessment) {
      return res.status(404).json({ message: 'assessment not found' });
    }

    res.status(200).json(assessment);
  } catch (error) {
    console.error('Error fetching assessment:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post('/', async (req, res) => {
    try {
      const {maximum_angle, minimum_angle, patient_user_id, doctor_user_id, joint, notes} = req.body;
      const session = await Assessment.createAssessment({maximum_angle, minimum_angle, patient_user_id, doctor_user_id, joint, notes});
      res.status(201).json(session);
    } catch (error) {
      console.error('Error creating session:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

module.exports = router;
