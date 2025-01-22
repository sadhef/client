const pool = require('../config/db');

class User {
  static async findByEmail(email) {
    try {
      const result = await pool.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );
      return result.rows[0];
    } catch (err) {
      throw err;
    }
  }

  static async create(username, email, password, role = 'user', approved = false) {
    try {
      const result = await pool.query(
        'INSERT INTO users (username, email, password, role, approved) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [username, email, password, role, approved]
      );
      return result.rows[0];
    } catch (err) {
      throw err;
    }
  }

  static async findById(id) {
    try {
      const result = await pool.query(
        'SELECT * FROM users WHERE id = $1',
        [id]
      );
      return result.rows[0];
    } catch (err) {
      throw err;
    }
  }

  static async getAllUsers() {
    try {
      const result = await pool.query(
        'SELECT id, username, email, role, approved FROM users ORDER BY created_at DESC'
      );
      return result.rows;
    } catch (err) {
      throw err;
    }
  }

  static async updateApprovalStatus(id, approved) {
    try {
      const result = await pool.query(
        'UPDATE users SET approved = $1 WHERE id = $2 RETURNING *',
        [approved, id]
      );
      return result.rows[0];
    } catch (err) {
      throw err;
    }
  }

  static async deleteUser(id) {
    try {
      await pool.query('DELETE FROM users WHERE id = $1', [id]);
      return true;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = User;