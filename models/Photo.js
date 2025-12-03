const db = require('../config/db');

const Photo = {
  async findById(id) {
    const [rows] = await db.query(
      `SELECT id, originalName, fileName, path, uploadDate, eventId
       FROM photos
       WHERE id = ?`,
      [id]
    );
    return rows[0] || null;
  },

  async findByEvent(eventId) {
    const [rows] = await db.query(
      `SELECT id, originalName, fileName, path, uploadDate, eventId
       FROM photos
       WHERE eventId = ?
       ORDER BY uploadDate DESC`,
      [eventId]
    );
    return rows;
  },

  async create(eventId, data) {
    const { originalName, fileName, path } = data;

    const [result] = await db.query(
      `INSERT INTO photos (originalName, fileName, path, eventId)
       VALUES (?, ?, ?, ?)`,
      [originalName, fileName, path, eventId]
    );

    return result.insertId;
  },

  async update(id, data) {
    const { originalName, fileName, path } = data;

    await db.query(
      `UPDATE photos
       SET originalName = ?, fileName = ?, path = ?
       WHERE id = ?`,
      [originalName, fileName, path, id]
    );
  },

  async delete(id) {
    await db.query('DELETE FROM photos WHERE id = ?', [id]);
  }
};

module.exports = Photo;
