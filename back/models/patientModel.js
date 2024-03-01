// models/patientModel.js
var db = require('../config/db');

class Patient {
  constructor({ user_id, age }) {
    this.user_id = user_id;
    this.age = age;
  }

  static async createPatient({ user_id, age }) {
    try {
      // Insert a new record in the patients table
      await db.execute('INSERT INTO patients (user_id, age) VALUES (?, ?)', [user_id, age]);

      return true; // Successful creation
    } catch (error) {
      console.error(error);
      throw new Error('Error creating patient in the database');
    }
  }

  static async getPatientUpcomingSessions(id){
    try {
      const [patients] = await db.query(`
      SELECT 
      sessions.id AS session_id,
      sessions.*,
      games.name AS game_name 
      FROM 
          sessions 
      INNER JOIN 
          games 
      ON 
          sessions.game_id = games.id 
      WHERE 
          patient_user_id = ? AND sessions.is_active = 1

      `, [id]);
    if (patients.length > 0) {
      const patientData = patients[0];
      return patients;
    }
      return null; 
    } catch (error) {
      console.error(error);
      throw new Error('Error fetching sessions');
    }
  }

  static async getPatientById(id) {
    try {
      const [patients] = await db.query(`
      SELECT
      patients.user_id AS patient_id,
      patients.age AS age,
      users.email AS email,
      users.first_name AS first_name,
      users.last_name AS last_name,
      sessions.score AS latest_score
    FROM
      patients
    INNER JOIN
      users ON patients.user_id = users.id
    INNER JOIN
      sessions ON patients.user_id = sessions.patient_user_id
    WHERE
      patients.user_id = ?;    
    `, [id]);
    if (patients.length > 0) {
      const patientData = patients[0];
      return patientData;
    }
      return null; 
    } catch (error) {
      console.error(error);
      throw new Error('Error fetching patient');
    }
  }

  static async getAllPatients() {
    try {
      // Query to fetch all patients with their related data from the database using a JOIN operation
      const [patients] = await db.query(`
        SELECT
          patients.user_id AS patient_id,
          patients.age AS age,
          users.email AS email,
          users.first_name AS first_name,
          users.last_name AS last_name
        FROM
          patients
        INNER JOIN
          users ON patients.user_id = users.id
      `);
      
      return patients;
    } catch (error) {
      console.error('Error fetching patients:', error);
      throw new Error('Error fetching patients');
    }
  }
}

module.exports = Patient;