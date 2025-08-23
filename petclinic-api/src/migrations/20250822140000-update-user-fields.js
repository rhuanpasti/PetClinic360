"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Users", "endereco", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("Users", "telefone", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("Users", "cpf", {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true,
    });
    await queryInterface.renameColumn("Users", "name", "nome");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.renameColumn("Users", "nome", "name");
    await queryInterface.removeColumn("Users", "endereco");
    await queryInterface.removeColumn("Users", "telefone");
    await queryInterface.removeColumn("Users", "cpf");
  },
};
