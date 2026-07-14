const mysql = require('mysql2/promise');
require('dotenv').config();

async function createDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || '',
    });
    
    await connection.query('CREATE DATABASE IF NOT EXISTS taskflow_db;');
    console.log('Database taskflow_db created or already exists.');
    await connection.end();
  } catch (error) {
    console.error('Failed to create database:', error);
  }
}

createDatabase();
