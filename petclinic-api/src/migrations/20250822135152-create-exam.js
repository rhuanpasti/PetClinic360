'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Exams', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false },
      petId: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'Pets', key: 'id' } },
      type: { type: Sequelize.STRING, allowNull: false },
      result: { type: Sequelize.STRING },
      date: { type: Sequelize.DATE, allowNull: false },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Exams');
  }
};
