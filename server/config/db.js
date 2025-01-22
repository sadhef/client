// config/db.js
const { Pool } = require('pg');
require('dotenv').config();

let pool = null;

const createPool = () => {
  return new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    ssl: process.env.DB_SSL === 'true' ? {
      rejectUnauthorized: false
    } : false
  });
};

const initializePool = async () => {
  try {
    if (!pool) {
      pool = createPool();
      // Test the connection
      const client = await pool.connect();
      console.log('Database pool initialized successfully');
      client.release();
      
      // Set up event handlers
      pool.on('connect', () => {
        console.log('New client connected to database');
      });

      pool.on('error', (err) => {
        console.error('Unexpected error on idle client', err);
        process.exit(-1);
      });
    }
    return pool;
  } catch (error) {
    console.error('Error initializing database pool:', error);
    throw error;
  }
};

const getPool = async () => {
  if (!pool) {
    await initializePool();
  }
  return pool;
};

const query = async (text, params) => {
  const client = await getPool();
  try {
    return await client.query(text, params);
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

const closePool = async () => {
  if (pool) {
    try {
      await pool.end();
      pool = null;
      console.log('Database pool closed successfully');
    } catch (error) {
      console.error('Error closing database pool:', error);
      throw error;
    }
  }
};

module.exports = {
  initializePool,
  getPool,
  query,
  closePool
};