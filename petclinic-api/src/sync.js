const sequelize = require('./config/database');
const User = require('./models/User');
const Pet = require('./models/Pet');
const Exam = require('./models/Exam');

// Associations
User.hasMany(Pet, { foreignKey: 'ownerId' });
Pet.belongsTo(User, { foreignKey: 'ownerId' });

Pet.hasMany(Exam, { foreignKey: 'petId' });
Exam.belongsTo(Pet, { foreignKey: 'petId' });

(async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('Database synced');
    process.exit();
  } catch (err) {
    console.error('Failed to sync database:', err);
    process.exit(1);
  }
})();
