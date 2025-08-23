const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Exam = sequelize.define('Exam', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  petId: { type: DataTypes.INTEGER, allowNull: false },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  tipoExame: { type: DataTypes.STRING, allowNull: false },
  data: { type: DataTypes.DATEONLY, allowNull: false },
  horario: { type: DataTypes.STRING, allowNull: false },
  laudo: { type: DataTypes.TEXT },
  pdfExame: { type: DataTypes.STRING },
  status: { type: DataTypes.STRING, defaultValue: 'agendado' }
});

module.exports = Exam;
