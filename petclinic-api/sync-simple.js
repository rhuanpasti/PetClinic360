const { sequelize, User, Pet, Exam, Appointment } = require('./src/models');

(async () => {
  try {
    // Drop all tables first
    await sequelize.drop();
    console.log('All tables dropped successfully.');
    
    // Create tables one by one
    await User.sync();
    console.log('Users table created successfully.');
    
    await Pet.sync();
    console.log('Pets table created successfully.');
    
    await Exam.sync();
    console.log('Exams table created successfully.');
    
    await Appointment.sync();
    console.log('Appointments table created successfully.');
    
    console.log('Database synced successfully.');
    process.exit();
  } catch (error) {
    console.error('Error syncing database:', error);
    process.exit(1);
  }
})();
