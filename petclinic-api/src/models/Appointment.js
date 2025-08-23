const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Appointment = sequelize.define('Appointment', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  data: { type: DataTypes.DATEONLY, allowNull: false },
  horario: { type: DataTypes.STRING, allowNull: false },
  sintomas: { type: DataTypes.TEXT, allowNull: false },
  laudo: { type: DataTypes.TEXT, allowNull: true },
  receituario: { type: DataTypes.STRING, allowNull: true },
  status: { type: DataTypes.ENUM('agendado', 'confirmado', 'cancelado', 'concluido'), defaultValue: 'agendado' },
});

module.exports = Appointment;
