const db = require('../config/db');

const Event = {
  async findById(id) {
    const [rows] = await db.query(
      `SELECT e.id,
              e.userId,
              e.eventName,
              e.eventDate,
              u.name AS userName
       FROM event_ e
       JOIN users u ON u.id = e.userId
       WHERE e.id = ? AND e.dateDeleted IS NULL`,
      [id]
    );
    return rows[0] || null;
  },

  async findByUser(userId, filters = {}) {
    let sql = `
      SELECT e.id,
             e.userId,
             e.eventName,
             e.eventDate
      FROM event_ e
      WHERE e.userId = ? AND e.dateDeleted IS NULL
    `;
    const params = [userId];

    if (filters.search) {
      sql += ' AND e.eventName LIKE ?';
      params.push(`%${filters.search}%`);
    }

    if (filters.date) {
      sql += ' AND e.eventDate = ?';
      params.push(filters.date);
    }

    sql += ' ORDER BY e.eventDate DESC';

    const [rows] = await db.query(sql, params);
    return rows;
  },

  async findAll(filters = {}) {
    let sql = `
      SELECT e.id,
             e.userId,
             e.eventName,
             e.eventDate,
             u.name AS userName
      FROM event_ e
      JOIN users u ON u.id = e.userId
      WHERE e.dateDeleted IS NULL
    `;
    const params = [];

    if (filters.search) {
      sql += ' AND e.eventName LIKE ?';
      params.push(`%${filters.search}%`);
    }

    if (filters.date) {
      sql += ' AND e.eventDate = ?';
      params.push(filters.date);
    }

    if (filters.clientName) {
      sql += ' AND u.name LIKE ?';
      params.push(`%${filters.clientName}%`);
    }

    sql += ' ORDER BY e.eventDate DESC';

    const [rows] = await db.query(sql, params);
    return rows;
  },

  async create(userId, data) {
    const { eventName, eventDate } = data;

    const [result] = await db.query(
      `INSERT INTO event_ (userId, eventName, eventDate)
       VALUES (?, ?, ?)`,
      [userId, eventName, eventDate || null]
    );

    return result.insertId;
  },

  async update(id, data) {
    const { eventName, eventDate } = data;

    await db.query(
      `UPDATE event_
       SET eventName = ?, eventDate = ?
       WHERE id = ? AND dateDeleted IS NULL`,
      [eventName, eventDate || null, id]
    );
  },

  async softDelete(id) {
    await db.query(
      'UPDATE event_ SET dateDeleted = NOW() WHERE id = ? AND dateDeleted IS NULL',
      [id]
    );
  }
};

module.exports = Event;
