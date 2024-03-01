// models/userModel.js
const bcrypt = require('bcrypt');
var db = require('../config/db')

class User {
  constructor({ id, email, password, role = 'doctor', first_name, last_name }) {
    this.email = email;
    this.password = password;
    this.role = role;
    this.id = id;
    this.first_name = first_name;
    this.last_name = last_name;
  }

  // Compare hashed password during login
  async comparePassword(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  }

  static async findByEmail(email) {
    try {
      const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
      if (rows.length > 0) {
        const userData = rows[0];
        return new User(userData);
      }
      return null; // No user found with the provided email
    } catch (error) {
      console.error(error);
      throw new Error('Error fetching user from the database');
    }
  }

  static async createUser({ email, password, role, first_name, last_name }) {
    try {

      // Insert a new user into the users table
      const [result] = await db.execute(
        'INSERT INTO users (email, password, role, first_name, last_name) VALUES (?, ?, ?, ?, ?)',
        [email, bcrypt.hashSync(password, 12), role, first_name, last_name]
      );

      const user_id = result.insertId; // Get the user_id of the inserted user

      return new User({
        user_id,
        email,
        password,
        role,
        first_name,
        last_name
      });
    } catch (error) {
      console.error(error);
      throw new Error('Error creating user in the database');
    }
  }

}

module.exports = User;
