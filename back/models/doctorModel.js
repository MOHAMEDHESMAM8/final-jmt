// models/doctorModel.js
var db = require('../config/db');

class Doctor {
  constructor({ user_id, specialization }) {
    this.user_id = user_id;
    this.specialization = specialization;
  }

  static async createDoctor({ user_id, specialization }) {
    console.log(user_id)
    try {
      const [result] = await db.execute(
        'INSERT INTO doctors (user_id) VALUES (?)',
        [user_id]
      );

      return new Doctor({
        user_id,
        specialization,
      });
    } catch (error) {
      console.error(error);
      throw new Error('Error creating doctor in the database');
    }
  }

  static async getDoctorByUserId(userId) {
    try {
      const [rows] = await db.execute('SELECT * FROM doctors WHERE user_id = ?', [userId]);
      if (rows.length > 0) {
        const doctorData = rows[0];
        return new Doctor(doctorData);
      }
      return null; // No doctor found with the provided user_id
    } catch (error) {
      console.error(error);
      throw new Error('Error fetching doctor from the database');
    }
  }

}

module.exports = Doctor;
