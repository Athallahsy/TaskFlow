const { Sequelize } = require('sequelize');
require('mysql2');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: false,
    dialectOptions: process.env.DB_SSL === 'true' ? {
      ssl: {
        require: true,
        rejectUnauthorized: true,
      }
    } : {},
    pool: {
      max: 2,
      min: 0,
      acquire: 30000,
      idle: 5000,
    },
  }
);

module.exports = sequelize;
