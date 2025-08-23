const sequelize = require('../config/database');
const User = require('./User');
const Pet = require('./Pet');
const Exam = require('./Exam');

// Associations
User.hasMany(Pet, { foreignKey: 'ownerId' });
Pet.belongsTo(User, { foreignKey: 'ownerId' });

Pet.hasMany(Exam, { foreignKey: 'petId' });
Exam.belongsTo(Pet, { foreignKey: 'petId' });

module.exports = { sequelize, User, Pet, Exam };
