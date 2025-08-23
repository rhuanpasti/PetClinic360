'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // First, drop the existing table
    await queryInterface.dropTable('Exams');
    
    // Create the new table with updated structure
    await queryInterface.createTable('Exams', {
      id: { 
        type: Sequelize.INTEGER, 
        autoIncrement: true, 
        primaryKey: true, 
        allowNull: false 
      },
      petId: { 
        type: Sequelize.INTEGER, 
        allowNull: false, 
        references: { model: 'Pets', key: 'id' } 
      },
      userId: { 
        type: Sequelize.INTEGER, 
        allowNull: false, 
        references: { model: 'Users', key: 'id' } 
      },
      tipoExame: { 
        type: Sequelize.STRING, 
        allowNull: false 
      },
      data: { 
        type: Sequelize.DATEONLY, 
        allowNull: false 
      },
      horario: { 
        type: Sequelize.STRING, 
        allowNull: false 
      },
      laudo: { 
        type: Sequelize.TEXT 
      },
      pdfExame: { 
        type: Sequelize.STRING 
      },
      status: { 
        type: Sequelize.ENUM('agendado', 'realizado', 'cancelado'), 
        defaultValue: 'agendado' 
      },
      createdAt: { 
        type: Sequelize.DATE, 
        allowNull: false 
      },
      updatedAt: { 
        type: Sequelize.DATE, 
        allowNull: false 
      }
    });
  },

  async down (queryInterface, Sequelize) {
    // Revert to the old structure
    await queryInterface.dropTable('Exams');
    
    await queryInterface.createTable('Exams', {
      id: { 
        type: Sequelize.INTEGER, 
        autoIncrement: true, 
        primaryKey: true, 
        allowNull: false 
      },
      petId: { 
        type: Sequelize.INTEGER, 
        allowNull: false, 
        references: { model: 'Pets', key: 'id' } 
      },
      type: { 
        type: Sequelize.STRING, 
        allowNull: false 
      },
      result: { 
        type: Sequelize.STRING 
      },
      date: { 
        type: Sequelize.DATE, 
        allowNull: false 
      },
      createdAt: { 
        type: Sequelize.DATE, 
        allowNull: false 
      },
      updatedAt: { 
        type: Sequelize.DATE, 
        allowNull: false 
      }
    });
  }
};
