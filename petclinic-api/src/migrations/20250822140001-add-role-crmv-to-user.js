"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Check if crmv column exists before adding it
    const tableDescription = await queryInterface.describeTable('Users');
    
    if (!tableDescription.crmv) {
      await queryInterface.addColumn("Users", "crmv", {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true
      });
    }
  },

  async down(queryInterface, Sequelize) {
    // Only remove crmv column if it exists
    const tableDescription = await queryInterface.describeTable('Users');
    
    if (tableDescription.crmv) {
      await queryInterface.removeColumn("Users", "crmv");
    }
  },
};
