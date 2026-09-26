const { Pool } = require('pg');
const fs = require('fs');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function addProductsTable() {
  try {
    console.log('🔧 Creating products table...');
    
    const sql = fs.readFileSync('./database/add-products-table.sql', 'utf8');
    await pool.query(sql);
    
    console.log('✅ Products table created successfully!');
    console.log('✅ Initial products inserted!');
    
    // Verify
    const result = await pool.query('SELECT COUNT(*) FROM products');
    console.log(`📦 Total products: ${result.rows[0].count}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

addProductsTable();
