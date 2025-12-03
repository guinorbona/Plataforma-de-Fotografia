const mysql = require('mysql2/promise');
const path = require('path');
const fs = require('fs');

require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

const certsPath = path.join(__dirname, 'certs');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  ssl: {
    ca: fs.readFileSync(path.join(certsPath, 'server-ca.pem')),
    key: fs.readFileSync(path.join(certsPath, 'client-key.pem')),
    cert: fs.readFileSync(path.join(certsPath, 'client-cert.pem')),
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;



