// controllers/sessionController.js
const express = require('express');
const bodyParser = require('body-parser');
const Session = require('../models/sessionModel');
const Patient = require('../models/patientModel');

const router = express.Router();
router.use(bodyParser.json());

// Get all patients
router.get('/', async (req, res) => {
  try {
    const sessions = await Session.getAllSessions();
    res.json(sessions);
  } catch (error) {
    console.error('Error fetching sessions:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


router.post('/', async (req, res) => {
  try {
    const {
      patient_user_id,
      doctor_user_id,
      game_id,
      start_angle,
      desired_angle,
      rra,
      scheduled_at,
      target_score
    } = req.body;
    console.log(req.body)

    const session = await Session.createSession({
      patient_user_id,
      doctor_user_id,
      game_id,
      start_angle,
      desired_angle,
      rra,
      scheduled_at,
      target_score
    });

    res.status(201).json(session);
  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/:sessionId', async (req, res) => {
  try {
    const sessionId = req.params.sessionId;
    const session = await Session.getSessionById(sessionId);

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    res.status(200).json(session);
  } catch (error) {
    console.error('Error fetching session:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.put('/:sessionId', async (req, res) => {
  try {
    const sessionId = req.params.sessionId;
    const {
      patient_user_id,
      doctor_user_id,
      game_id,
      start_angle,
      desired_angle,
      rra,
      scheduled_at,
      target_score,
      time_taken,
      rra_user,
      score,
      is_active
    } = req.body;

    const updatedSession = await Session.updateSession({
      sessionId,
      patient_user_id,
      doctor_user_id,
      game_id,
      start_angle,
      desired_angle,
      rra,
      scheduled_at,
      target_score,
      time_taken,
      rra_user,
      score,
      is_active
    });

    if (!updatedSession) {
      return res.status(404).json({ message: 'Session not found' });
    }

    res.status(200).json(updatedSession);
  } catch (error) {
    console.error('Error updating session:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.delete('/:sessionId', async (req, res) => {
  try {
    const sessionId = req.params.sessionId;
    const result = await Session.deleteSession(sessionId);

    if (!result) {
      return res.status(404).json({ message: 'Session not found' });
    }

    res.status(204).end(); // Successful deletion
  } catch (error) {
    console.error('Error deleting session:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
