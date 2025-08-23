require('dotenv').config();
const Sequelize = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,   
  process.env.DB_PASS,    
  {
    host: process.env.DB_HOST, 
    port: process.env.DB_PORT || 1433, 
    dialect: 'mssql',
    dialectOptions: {
      options: {
        encrypt: false,             
        trustServerCertificate: true 
      },
      requestTimeout: 5000
    }
  }
);

module.exports = sequelize;
