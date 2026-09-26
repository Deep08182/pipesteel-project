const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function fixPhoneColumn() {
  try {
    console.log('🔧 Fixing phone column to be nullable...');
    
    // Make phone column nullable
    await pool.query('ALTER TABLE users ALTER COLUMN phone DROP NOT NULL');
    
    console.log('✅ Phone column is now nullable');
    
    // Verify the change
    const result = await pool.query(`
      SELECT column_name, is_nullable, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name = 'phone'
    `);
    
    console.log('📋 Column info:', result.rows[0]);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

fixPhoneColumn();
