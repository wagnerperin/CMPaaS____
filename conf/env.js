const dotenv = require('dotenv').config();

module.exports = {
  DB_AUTH_SOURCE: process.env.DB_AUTH_SOURCE || '',
  DB_PASS: process.env.DB_PASS || '',
  DB_USER: process.env.DB_USER || '',
  NODE_ENV: process.env.NODE_ENV || 'development',
  HOST: process.env.HOST || 'localhost',
  PORT: process.env.PORT || 3000,
  DBURI: process.env.DBURI || 'mongodb://localhost:27017/CMPaaS'
}