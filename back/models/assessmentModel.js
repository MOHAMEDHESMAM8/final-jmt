// models/gameModel.js
var db = require('../config/db');

class Assessment {
  constructor({ id, maximum_angle, minimum_angle, patient_user_id, doctor_user_id, joint, notes, creation_date }) {
    this.id = id;
    this.maximum_angle = maximum_angle;
    this.minimum_angle = minimum_angle;
    this.patient_user_id = patient_user_id;
    this.doctor_user_id = doctor_user_id;
    this.joint = joint;
    this.notes = notes;
    this.creation_date = creation_date;
  }

  static async getAllAssessments() {
    try {
      const [assessments] = await db.query('SELECT * FROM assessments');
      return assessments;
    } catch (error) {
      console.error('Error fetching assessments:', error);
      throw new Error('Error fetching assessments');
    }
  }

  static async getAssessmentById(assessmentId) {
    try {
      const [rows] = await db.execute('SELECT * FROM assessments WHERE patient_user_id = ?', [assessmentId]);
      if (rows.length > 0) {
        return rows;
      }
      return null; // No assessment found with the provided ID
    } catch (error) {
      console.error(error);
      throw new Error('Error fetching assessment from the database');
    }
  }

  static async createAssessment({maximum_angle, patient_user_id, doctor_user_id, joint, notes}) {
    try {
      // Insert a new record in the patients table
      await db.execute('INSERT INTO assessments (maximum_angle, patient_user_id, doctor_user_id, joint, notes) VALUES ( ?, ?, ?, ?, ?)', [maximum_angle, patient_user_id, doctor_user_id, joint, notes]);

      return true; // Successful creation
    } catch (error) {
      console.error(error);
      throw new Error('Error creating patient in the database');
    }
  }
}

module.exports = Assessment;
