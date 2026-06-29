const { Client } = require('pg');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function seed() {
  try {
    console.log('Generating bcrypt hash for password "rydway123"...');
    const hash = await bcrypt.hash('rydway123', 10);
    
    console.log('Reading seed.sql...');
    const sqlPath = path.join(__dirname, 'seed.sql');
    let sql = fs.readFileSync(sqlPath, 'utf8');
    
    // Replace placeholder with actual hash
    sql = sql.replace(/REPLACE_WITH_BCRYPT_HASH_OF_rydway123/g, hash);
    
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      throw new Error('DATABASE_URL not found in .env');
    }
    
    console.log('Connecting to database...');
    const client = new Client({
      connectionString: dbUrl
    });
    
    await client.connect();
    console.log('Connected to database successfully.');
    
    console.log('Executing seed SQL script...');
    await client.query(sql);
    
    console.log('✅ Seed successful! Added 30 Abuja car rental businesses.');
    await client.end();
  } catch (e) {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  }
}

seed();
