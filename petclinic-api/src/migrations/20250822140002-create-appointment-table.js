"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Appointments', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      data: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      horario: {
        type: Sequelize.STRING,
        allowNull: false
      },
      sintomas: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      laudo: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      receituario: {
        type: Sequelize.STRING,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('agendado', 'confirmado', 'cancelado', 'concluido'),
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

    // Add indexes for better performance
    await queryInterface.addIndex('Appointments', ['userId']);
    await queryInterface.addIndex('Appointments', ['data', 'horario']);
    await queryInterface.addIndex('Appointments', ['status']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Appointments');
  }
};
