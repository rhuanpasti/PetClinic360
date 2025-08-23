const sequelize = require('../config/database');
const User = require('./User');
const Pet = require('./Pet');
const Exam = require('./Exam');
const Appointment = require('./Appointment');

// Associations
User.hasMany(Pet, { foreignKey: 'ownerId' });
Pet.belongsTo(User, { foreignKey: 'ownerId' });

Pet.hasMany(Exam, { foreignKey: 'petId' });
Exam.belongsTo(Pet, { foreignKey: 'petId' });

User.hasMany(Exam, { foreignKey: 'userId' });
Exam.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Appointment, { foreignKey: 'userId' });
Appointment.belongsTo(User, { foreignKey: 'userId' });

module.exports = { sequelize, User, Pet, Exam, Appointment };
