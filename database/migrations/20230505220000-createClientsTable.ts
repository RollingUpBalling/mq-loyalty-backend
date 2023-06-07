import { DataTypes, QueryInterface, Sequelize } from 'sequelize';

export = {
  up: async (sequelize: Sequelize): Promise<void> => {
    const queryInterface = sequelize.getQueryInterface();
    await queryInterface.createTable('Clients', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
    });
  },
  down: async (sequelize: Sequelize): Promise<void> => {
    const queryInterface = sequelize.getQueryInterface();
    await queryInterface.dropTable('Clients');
  },
};
