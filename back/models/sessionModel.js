// models/sessionModel.js
var db = require('../config/db');

class Session {
  constructor({
    id,
    patient_user_id,
    doctor_user_id,
    game_id,
    start_angle,
    desired_angle,
    time_taken,
    rra,
    rra_user,
    score,
    scheduled_at,
    target_score
  }) {
    this.id = id;
    this.patient_user_id = patient_user_id;
    this.doctor_user_id = doctor_user_id;
    this.game_id = game_id;
    this.start_angle = start_angle;
    this.desired_angle = desired_angle;
    this.time_taken = time_taken;
    this.rra = rra;
    this.rra_user = rra_user;
    this.score = score;
    this.scheduled_at = scheduled_at;
    this.target_score = target_score;
  }

  static async getAllSessions() {
    try {
      // Query to fetch all sessions with their related data from the database using a JOIN operation
      const [sessions] = await db.query(`
      SELECT
      sessions.id,
      sessions.scheduled_at AS scheduled_at,
      sessions.patient_user_id AS patient_id,
      sessions.target_score AS target_score,
      sessions.rra AS rra,
      sessions.desired_angle,
      users.first_name AS first_name,
      users.last_name AS last_name,
      games.name AS game_name,
      patients.age AS patient_age
      FROM
          sessions
      INNER JOIN
          users ON sessions.patient_user_id = users.id
      INNER JOIN
          patients ON sessions.patient_user_id = patients.user_id
      INNER JOIN
          games ON sessions.game_id = games.id
      WHERE
          sessions.is_active = 1
      `);
      
      return sessions;
    } catch (error) {
      console.error('Error fetching sessions:', error);
      throw new Error('Error fetching sessions');
    }
  }

  static async createSession({
    patient_user_id,
    doctor_user_id,
    game_id,
    start_angle,
    desired_angle,
    rra,
    scheduled_at,
    target_score
  }) {
    try {
      console.log(patient_user_id, doctor_user_id, game_id, start_angle, desired_angle, rra, scheduled_at, target_score, 'ggffg')
      const [result] = await db.execute(
        'INSERT INTO sessions (patient_user_id, doctor_user_id, game_id, start_angle, desired_angle, rra, target_score, scheduled_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [parseInt(patient_user_id), parseInt(doctor_user_id), parseInt(game_id), parseInt(start_angle), parseInt(desired_angle), parseInt(rra), parseInt(target_score), scheduled_at]
      );

      const session_id = result.insertId;

      return new Session({
        id: session_id,
      });
    } catch (error) {
      console.error(error);
      throw new Error('Error creating session in the database');
    }
  }

  static async getSessionById(sessionId) {
    try {
      const [rows] = await db.execute('SELECT * FROM sessions WHERE id = ?', [sessionId]);
      if (rows.length > 0) {
        const sessionData = rows[0];
        return new Session(sessionData);
      }
      return null; // No session found with the provided ID
    } catch (error) {
      console.error(error);
      throw new Error('Error fetching session from the database');
    }
  }

  static async updateSession({
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
  }) {
    try {
      let sql = 'UPDATE sessions SET';
      let values = [];
      let updates = [];
      
      if (time_taken !== undefined) {
        updates.push('time_taken = ?');
        values.push(time_taken);
      }
      if (is_active !== undefined) {
        updates.push('is_active = ?');
        values.push(is_active);
      }
      if (rra !== undefined) {
        updates.push('rra = ?');
        values.push(rra);
      }
      if (rra_user !== undefined) {
        updates.push('rra_user = ?');
        values.push(rra_user);
      }
      if (score !== undefined) {
        updates.push('score = ?');
        values.push(score);
      }
      if (patient_user_id !== undefined) {
        updates.push('patient_user_id = ?');
        values.push(parseInt(patient_user_id));
      }
      if (doctor_user_id !== undefined) {
        updates.push('doctor_user_id = ?');
        values.push(parseInt(doctor_user_id));
      }
      if (game_id !== undefined) {
        updates.push('game_id = ?');
        values.push(parseInt(game_id));
      }
      if (start_angle !== undefined) {
        updates.push('start_angle = ?');
        values.push(parseInt(start_angle));
      }
      if (desired_angle !== undefined) {
        updates.push('desired_angle = ?');
        values.push(parseInt(desired_angle));
      }
      if (rra !== undefined) {
        updates.push('rra = ?');
        values.push(parseInt(rra));
      }
      if (target_score !== undefined) {
        updates.push('target_score = ?');
        values.push(parseInt(target_score));
      }
      if (scheduled_at !== undefined) {
        updates.push('scheduled_at = ?');
        values.push(scheduled_at);
      }
  
      sql += ` ${updates.join(',')} WHERE id = ?`;
      values.push(parseInt(sessionId));
  
      await db.execute(sql, values);
  
      const updatedSession = await Session.getSessionById(sessionId);
      return updatedSession;
    } catch (error) {
      console.error(error);
      throw new Error('Error updating session in the database');
    }
  }
  

  static async deleteSession(sessionId) {
    try {
      await db.execute('DELETE FROM sessions WHERE id = ?', [sessionId]);
      return true; // Deletion successful
    } catch (error) {
      console.error(error);
      throw new Error('Error deleting session from the database');
    }
  }


}

module.exports = Session;
