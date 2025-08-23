const { sequelize } = require('./src/models');

(async () => {
  try {
    // Drop all tables first
    await sequelize.drop();
    console.log('All tables dropped successfully.');
    
    // Create tables without foreign keys first
    await sequelize.query(`
      CREATE TABLE [Users] (
        [id] INTEGER IDENTITY(1,1) PRIMARY KEY,
        [nome] NVARCHAR(255) NOT NULL,
        [email] NVARCHAR(255) NOT NULL UNIQUE,
        [password] NVARCHAR(255) NOT NULL,
        [role] NVARCHAR(255) DEFAULT 'user',
        [endereco] NVARCHAR(255) NULL,
        [telefone] NVARCHAR(255) NULL,
        [cpf] NVARCHAR(255) NULL UNIQUE,
        [crmv] NVARCHAR(255) NULL UNIQUE,
        [createdAt] DATETIMEOFFSET NOT NULL,
        [updatedAt] DATETIMEOFFSET NOT NULL
      )
    `);
    console.log('Users table created successfully.');
    
    await sequelize.query(`
      CREATE TABLE [Pets] (
        [id] INTEGER IDENTITY(1,1) PRIMARY KEY,
        [name] NVARCHAR(255) NOT NULL,
        [species] NVARCHAR(255) NOT NULL,
        [breed] NVARCHAR(255) NULL,
        [age] INTEGER NULL,
        [ownerId] INTEGER NOT NULL,
        [createdAt] DATETIMEOFFSET NOT NULL,
        [updatedAt] DATETIMEOFFSET NOT NULL
      )
    `);
    console.log('Pets table created successfully.');
    
    await sequelize.query(`
      CREATE TABLE [Exams] (
        [id] INTEGER IDENTITY(1,1) PRIMARY KEY,
        [petId] INTEGER NOT NULL,
        [userId] INTEGER NOT NULL,
        [tipoExame] NVARCHAR(255) NOT NULL,
        [data] DATE NOT NULL,
        [horario] NVARCHAR(255) NOT NULL,
        [laudo] NVARCHAR(MAX) NULL,
        [pdfExame] NVARCHAR(255) NULL,
        [status] NVARCHAR(255) DEFAULT 'agendado',
        [createdAt] DATETIMEOFFSET NOT NULL,
        [updatedAt] DATETIMEOFFSET NOT NULL
      )
    `);
    console.log('Exams table created successfully.');
    
    await sequelize.query(`
      CREATE TABLE [Appointments] (
        [id] INTEGER IDENTITY(1,1) PRIMARY KEY,
        [userId] INTEGER NOT NULL,
        [petId] INTEGER NOT NULL,
        [data] DATE NOT NULL,
        [horario] NVARCHAR(255) NOT NULL,
        [motivo] NVARCHAR(255) NOT NULL,
        [status] NVARCHAR(255) DEFAULT 'agendado',
        [createdAt] DATETIMEOFFSET NOT NULL,
        [updatedAt] DATETIMEOFFSET NOT NULL
      )
    `);
    console.log('Appointments table created successfully.');
    
    // Now add foreign keys
    await sequelize.query(`
      ALTER TABLE [Pets] ADD CONSTRAINT [FK_Pets_Users] 
      FOREIGN KEY ([ownerId]) REFERENCES [Users] ([id])
    `);
    console.log('Pets foreign key added successfully.');
    
    await sequelize.query(`
      ALTER TABLE [Exams] ADD CONSTRAINT [FK_Exams_Pets] 
      FOREIGN KEY ([petId]) REFERENCES [Pets] ([id])
    `);
    console.log('Exams-Pets foreign key added successfully.');
    
    await sequelize.query(`
      ALTER TABLE [Exams] ADD CONSTRAINT [FK_Exams_Users] 
      FOREIGN KEY ([userId]) REFERENCES [Users] ([id])
    `);
    console.log('Exams-Users foreign key added successfully.');
    
    await sequelize.query(`
      ALTER TABLE [Appointments] ADD CONSTRAINT [FK_Appointments_Users] 
      FOREIGN KEY ([userId]) REFERENCES [Users] ([id])
    `);
    console.log('Appointments-Users foreign key added successfully.');
    
    await sequelize.query(`
      ALTER TABLE [Appointments] ADD CONSTRAINT [FK_Appointments_Pets] 
      FOREIGN KEY ([petId]) REFERENCES [Pets] ([id])
    `);
    console.log('Appointments-Pets foreign key added successfully.');
    
    console.log('Database synced successfully.');
    process.exit();
  } catch (error) {
    console.error('Error syncing database:', error);
    process.exit(1);
  }
})();
