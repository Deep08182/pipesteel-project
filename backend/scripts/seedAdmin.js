const bcrypt = require('bcrypt');
const db = require('../database/db');
require('dotenv').config();

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.error('ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env');
    process.exit(1);
  }

  try {
    // Check if admin already exists
    const checkQuery = 'SELECT * FROM users WHERE email = $1';
    const checkResult = await db.query(checkQuery, [email]);
    
    if (checkResult.rows.length > 0) {
      console.log('Admin user already exists.');
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const insertQuery = `
      INSERT INTO users (name, email, phone, password_hash, role)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    
    const result = await db.query(insertQuery, ['System Admin', email, 'N/A', passwordHash, 'admin']);
    console.log(`Admin created successfully: ${result.rows[0].email}`);
    process.exit(0);

  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
}

seedAdmin();
