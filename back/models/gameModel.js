// models/gameModel.js
var db = require('../config/db');

class Game {
  constructor({ id, name, description }) {
    this.id = id;
    this.name = name;
    this.description = description
  }

  static async getAllGames() {
    try {
      // Query to fetch all patients with their related data from the database using a JOIN operation
      const [games] = await db.query('SELECT * FROM games');
      
      return games;
    } catch (error) {
      console.error('Error fetching patients:', error);
      throw new Error('Error fetching patients');
    }
  }
}

module.exports = Game;
