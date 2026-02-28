import 'dotenv/config';
import pg from 'pg';
const { Pool } = pg;

// Database connection pool with SSL support for AWS RDS
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'bandz',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

// Test connection
pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

// Initial connection test
pool.query('SELECT NOW()')
  .then(() => console.log('Database connection verified'))
  .catch((err) => console.error('Database connection failed:', err.message));

export default pool;
