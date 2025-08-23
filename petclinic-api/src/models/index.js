const sequelize = require('./config/database');
const User = require('./models/User');
const Pet = require('./models/Pet');
const Exam = require('./models/Exam');

// Associations
User.hasMany(Pet, { foreignKey: 'ownerId' });
Pet.belongsTo(User, { foreignKey: 'ownerId' });

Pet.hasMany(Exam, { foreignKey: 'petId' });
Exam.belongsTo(Pet, { foreignKey: 'petId' });

module.exports = { sequelize, User, Pet, Exam };
