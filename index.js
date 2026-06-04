const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.query('SELECT NOW()')
  .then(res => {
    console.log('✅ Connection Successful!');
    console.log('Database Time:', res.rows[0].now);
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Connection Failed Detail:', err);
    process.exit(1);
  });
