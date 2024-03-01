// gamesController.js

const express = require('express');
const bodyParser = require('body-parser');
const Game = require('../models/gameModel');

const router = express.Router();
router.use(bodyParser.json());

// Get all Games
router.get('/', async (req, res) => {
    try {
      const games = await Game.getAllGames();
      res.json(games);
    } catch (error) {
      console.error('Error fetching games:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
});





module.exports = router;
