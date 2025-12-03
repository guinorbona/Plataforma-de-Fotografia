const db = require('../config/db');

const User = {
  async findById(id) {
    const [rows] = await db.query(
      'SELECT id, name, email, role, mustChangePassword FROM users WHERE id = ? AND dateDeleted IS NULL',
      [id]
    );
    return rows[0] || null;
  },

  async findByEmail(email) {
    const [rows] = await db.query(
      'SELECT * FROM users WHERE email = ? AND dateDeleted IS NULL',
      [email]
    );
    return rows[0] || null;
  },

  async findAll(filters = {}) {
    let sql = `
      SELECT id, name, email, role
      FROM users
      WHERE dateDeleted IS NULL
    `;
    const params = [];

    if (filters.name) {
      sql += ' AND name LIKE ?';
      params.push(`%${filters.name}%`);
    }

    if (filters.role) {
      sql += ' AND role = ?';
      params.push(filters.role);
    }

    sql += ' ORDER BY id DESC';

    const [rows] = await db.query(sql, params);
    return rows;
  },

  async create(data) {
    const { name, email, role, passwordHash, mustChangePassword = 0 } = data;

    const [result] = await db.query(
      `INSERT INTO users (name, email, role, password_hash, mustChangePassword)
     VALUES (?, ?, ?, ?, ?)`,
      [name, email, role || 'cliente', passwordHash, mustChangePassword]
    );

    return result.insertId;
  },


  async update(id, data) {
    const { name, email, role } = data;

    await db.query(
      `UPDATE users
       SET name = ?, email = ?, role = ?
       WHERE id = ? AND dateDeleted IS NULL`,
      [name, email, role, id]
    );
  },

  async softDelete(id) {
    await db.query(
      'UPDATE users SET dateDeleted = NOW() WHERE id = ? AND dateDeleted IS NULL',
      [id]
    );
  },

  async updatePassword(id, newPasswordHash, mustChangePassword = 0) {
    await db.query(
      `UPDATE users
     SET password_hash = ?, mustChangePassword = ?
     WHERE id = ? AND dateDeleted IS NULL`,
      [newPasswordHash, mustChangePassword, id]
    );
  }

};

module.exports = User;
